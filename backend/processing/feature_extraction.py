import torch
import torchaudio
import torchaudio.transforms as transforms
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def compute_noise_level(waveform):
    """Estimate noise level using standard deviation of silent sections."""
    return round(waveform.std().item(), 4)

def generate_spectrogram(waveform, sr):
    """Generate and return a spectrogram image in Base64 format."""
    mel_spec = transforms.MelSpectrogram(sample_rate=sr, n_mels=64).to(device)(waveform)

    plt.figure(figsize=(8, 4))
    plt.imshow(mel_spec.log2()[0].cpu().detach().numpy(), cmap="inferno", aspect="auto")
    plt.title("Mel Spectrogram")
    plt.xlabel("Time")
    plt.ylabel("Mel Frequency")
    plt.colorbar()

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    spectrogram_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    plt.close()

    return spectrogram_base64

def generate_waveform_plot(waveform):
    """Generate a waveform plot and return it as a Base64 string."""
    plt.figure(figsize=(8, 2))
    plt.plot(waveform.t().cpu().numpy()[0])  # Plot the first channel
    plt.title("Waveform")
    plt.xlabel("Time")
    plt.ylabel("Amplitude")

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    waveform_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    plt.close()

    return waveform_base64

def extract_features_torch(file_path):
    try:
        print(f"🟢 Loading audio file: {file_path}")
        waveform, sr = torchaudio.load(file_path)
        waveform = waveform.to(device)
        print(f"✅ Loaded waveform: {waveform.shape}, Sample Rate: {sr}")

        duration = waveform.shape[1] / sr  # Calculate duration in seconds
        noise_level = compute_noise_level(waveform)
        loudness_db = round(20 * torch.log10(waveform.abs().mean()).item(), 2)

        # Extract spectrogram and waveform plots
        spectrogram_base64 = generate_spectrogram(waveform, sr)
        waveform_plot_base64 = generate_waveform_plot(waveform)

        # Extract pitch (if the function exists in your torchaudio version)
        try:
            pitch = torchaudio.functional.detect_pitch_frequency(waveform, sr).mean().item()
        except Exception:
            pitch = "Not available"

        return {
            "duration": round(duration, 2),
            "noise_level": noise_level,
            "loudness": loudness_db,
            "pitch": pitch,
            "spectrogram": spectrogram_base64,
            "waveform_plot": waveform_plot_base64
        }
    except Exception as e:
        print(f"🔥 Feature extraction error: {e}")
        raise e
