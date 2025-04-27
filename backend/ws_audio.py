import tempfile
from fastapi import WebSocket, WebSocketDisconnect
from processing.feature_extraction import extract_features  # Your real logic

async def handle_websocket_audio(websocket: WebSocket):
    await websocket.accept()
    try:
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp_audio:
            while True:
                chunk = await websocket.receive_bytes()
                tmp_audio.write(chunk)
                tmp_audio.flush()

                # Use your feature extractor here
                result = extract_features(tmp_audio.name)
                await websocket.send_json(result)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print("Error:", e)
        await websocket.close()
