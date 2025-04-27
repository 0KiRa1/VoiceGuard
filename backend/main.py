from fastapi import FastAPI, UploadFile, File
import os
import traceback
from fastapi.middleware.cors import CORSMiddleware
import ffmpeg
import librosa
import soundfile as sf
import noisereduce as nr
import base64
from processing.feature_extraction import extract_features_torch

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

latest_result = {}

def convert_to_wav(input_path: str, output_path: str):
    try:
        ffmpeg.input(input_path).output(output_path).run(overwrite_output=True, quiet=True)
        return True
    except Exception as e:
        print(f"🔥 ffmpeg conversion error: {e}")
        return False

def convert_wav_to_mp3(wav_path, mp3_path):
    try:
        ffmpeg.input(wav_path).output(mp3_path, format='mp3').run(overwrite_output=True, quiet=True)
        return True
    except Exception as e:
        print(f"🔥 ffmpeg mp3 conversion error: {e}")
        return False

def read_file_base64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

@app.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    try:
        original_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(original_path, "wb") as f:
            f.write(await file.read())

        file_extension = os.path.splitext(file.filename)[1]
        base_filename = os.path.splitext(file.filename)[0]
        wav_path = os.path.join(UPLOAD_DIR, f"{base_filename}.wav")

        if file_extension != ".wav":
            if not convert_to_wav(original_path, wav_path):
                return {"error": "Audio format conversion failed."}
        else:
            wav_path = original_path

        y, sr = librosa.load(wav_path, sr=None)
        reduced_noise = nr.reduce_noise(y=y, sr=sr)
        denoised_wav_path = os.path.join(UPLOAD_DIR, f"denoised_{base_filename}.wav")
        sf.write(denoised_wav_path, reduced_noise, sr)

        # Convert both to mp3
        raw_mp3 = os.path.join(UPLOAD_DIR, f"{base_filename}.mp3")
        denoised_mp3 = os.path.join(UPLOAD_DIR, f"denoised_{base_filename}.mp3")
        convert_wav_to_mp3(wav_path, raw_mp3)
        convert_wav_to_mp3(denoised_wav_path, denoised_mp3)

        # Extract features
        features_raw = extract_features_torch(wav_path)
        features_denoised = extract_features_torch(denoised_wav_path)

        global latest_result
        latest_result = {
            "raw": {
                "audio_data": read_file_base64(raw_mp3),
                "file_extension": ".mp3",
                "duration": features_raw["duration"],
                "noise_level": features_raw["noise_level"],
                "loudness": features_raw["loudness"],
                "pitch": features_raw["pitch"],
                "spectrogram": features_raw["spectrogram"],
                "waveform_plot": features_raw["waveform_plot"]
            },
            "denoised": {
                "audio_data": read_file_base64(denoised_mp3),
                "file_extension": ".mp3",
                "duration": features_denoised["duration"],
                "noise_level": features_denoised["noise_level"],
                "loudness": features_denoised["loudness"],
                "pitch": features_denoised["pitch"],
                "spectrogram": features_denoised["spectrogram"],
                "waveform_plot": features_denoised["waveform_plot"]
            }
        }

        return latest_result

    except Exception as e:
        print("🔥 Error processing audio:", str(e))
        print(traceback.format_exc())
        return {"error": "Failed to process audio", "details": str(e)}

@app.get("/latest-results")
async def get_latest_results():
    return latest_result if latest_result else {"error": "No data available"}
