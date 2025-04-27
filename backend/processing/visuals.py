import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np

def plot_waveform(waveform, sr):
    # Plot waveform using librosa and matplotlib
    plt.figure(figsize=(10, 4))
    librosa.display.waveshow(waveform, sr=sr)
    plt.title("Waveform")
    plt.xlabel("Time (s)")
    plt.ylabel("Amplitude")
    waveform_image = "waveform.png"
    plt.savefig(waveform_image)
    plt.close()
    return waveform_image

def plot_spectrogram(waveform, sr):
    # Create a spectrogram using librosa and matplotlib
    plt.figure(figsize=(10, 4))
    D = librosa.amplitude_to_db(abs(librosa.stft(waveform)), ref=np.max)
    librosa.display.specshow(D, sr=sr, x_axis="time", y_axis="log")
    plt.title("Spectrogram")
    plt.colorbar(format="%+2.0f dB")
    spectrogram_image = "spectrogram.png"
    plt.savefig(spectrogram_image)
    plt.close()
    return spectrogram_image
