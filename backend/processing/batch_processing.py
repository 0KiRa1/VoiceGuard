# File: processing/batch_processing.py

from concurrent.futures import ProcessPoolExecutor
from processing.feature_extraction import extract_features

def process_audio_batch(file_paths):
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(extract_features, file_paths))
    return results
