import noisereduce as nr
import librosa
import numpy as np

def apply_denoise_filter(input_path: str, output_path: str):
    try:
        # Load the audio file using librosa
        y, sr = librosa.load(input_path, sr=None, mono=False)
        
        # Check if the loaded audio has the correct shape
        if y.shape[0] == 0:
            raise ValueError("Loaded audio has no data")
        
        # Apply noise reduction
        reduced = nr.reduce_noise(y=y, sr=sr)
        
        # Save the denoised audio to the output path
        librosa.output.write_wav(output_path, reduced, sr)
        
        return reduced  # return the denoised audio for further processing
    except Exception as e:
        print(f"🔥 Error in denoising: {str(e)}")
        raise e
