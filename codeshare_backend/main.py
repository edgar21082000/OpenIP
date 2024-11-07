from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI()

# Middleware to allow CORS for development
origins = [
    'https://localhost:3000',
    'https://localhost:3000/',
    'https://127.0.0.1:3000',
    'https://127.0.0.1:3000/',
    'http://localhost:3000',
    'http://localhost:3000/',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3000/',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dictionary to store connected clients for each room
rooms = {}
usernames = {}  # Store usernames for each room

@app.post("/create_room")
async def create_room():
    """
    Endpoint to create a new room. Returns a unique room_id.
    """
    room_id = str(uuid.uuid4())
    rooms[room_id] = []  # Initialize an empty list of clients for the room
    usernames[room_id] = []  # Initialize an empty list of usernames for the room
    return {"room_id": room_id}

@app.websocket("/ws/room/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """
    WebSocket endpoint for a specific room.
    Clients can join a room and their messages will be broadcast to others in the same room.
    """
    # Check if the room exists, if not, return 403 Forbidden
    if room_id not in rooms:
        await websocket.close(code=403)
        return

    await websocket.accept()
    rooms[room_id].append(websocket)

    username = None

    try:
        while True:
            data = await websocket.receive_json()

            if data["type"] == "join":
                username = data["username"]
                if username and username not in usernames[room_id]:
                    usernames[room_id].append(username)

                # Notify all clients about the updated list of usernames
                for client in rooms[room_id]:
                    await client.send_json({"type": "user_list", "usernames": usernames[room_id]})

            elif data["type"] == "text":
                # Broadcast the text to all clients in the same room
                for client in rooms[room_id]:
                    if client != websocket:
                        await client.send_json({"type": "text", "payload": data["payload"]})

    except WebSocketDisconnect:
        # Remove the disconnected websocket from the room
        rooms[room_id].remove(websocket)

        # Remove disconnected user from the usernames list
        if username and username in usernames[room_id]:
            usernames[room_id].remove(username)

        # Notify remaining clients about the updated user list
        for client in rooms[room_id]:
            await client.send_json({"type": "user_list", "usernames": usernames[room_id]})

        # Clean up the room if no clients are left
        if not rooms[room_id]:
            del rooms[room_id]
            del usernames[room_id]
