import librosa
import numpy as np
from scipy.spatial.distance import euclidean
from fastdtw import fastdtw

def load_audio(file_path):
    y, sr = librosa.load(file_path, sr=22050)
    return y, sr

def extract_instrument_features(y, sr, instrument_type):
    features = {}
    
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = []
    for t in range(pitches.shape[1]):
        index = magnitudes[:, t].argmax()
        pitch = pitches[index, t]
        if pitch > 0:
            pitch_values.append(pitch)
    
    features['pitch'] = np.array(pitch_values) if pitch_values else np.array([0])
    
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    features['tempo'] = float(np.asarray(tempo).item())
    
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    features['rhythm'] = onset_env
    
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    features['timbre'] = mfcc
    
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    features['spectral_centroid'] = spectral_centroid
    
    return features

def compare_pitch(pitch1, pitch2):
    if len(pitch1) == 0 or len(pitch2) == 0:
        return 0.0
    
    min_len = min(len(pitch1), len(pitch2))
    pitch1 = pitch1[:min_len]
    pitch2 = pitch2[:min_len]
    
    pitch1_hz = librosa.hz_to_midi(pitch1 + 1e-6)
    pitch2_hz = librosa.hz_to_midi(pitch2 + 1e-6)
    
    differences = np.abs(pitch1_hz - pitch2_hz)
    accuracy = 100 * np.exp(-np.mean(differences) / 12)
    
    return min(100, max(0, accuracy))

def compare_tempo(tempo1, tempo2):
    tempo_diff = abs(tempo1 - tempo2)
    accuracy = 100 * np.exp(-tempo_diff / 30)
    return min(100, max(0, accuracy))

def compare_rhythm(rhythm1, rhythm2):
    min_len = min(len(rhythm1), len(rhythm2))
    rhythm1 = rhythm1[:min_len]
    rhythm2 = rhythm2[:min_len]
    
    distance, _ = fastdtw(rhythm1.reshape(-1, 1), rhythm2.reshape(-1, 1), dist=euclidean)
    normalized_distance = distance / min_len
    accuracy = 100 * np.exp(-normalized_distance / 10)
    
    return min(100, max(0, accuracy))

def compare_timbre(timbre1, timbre2):
    min_frames = min(timbre1.shape[1], timbre2.shape[1])
    timbre1 = timbre1[:, :min_frames]
    timbre2 = timbre2[:, :min_frames]
    
    mfcc_distance = np.mean(np.sqrt(np.sum((timbre1 - timbre2) ** 2, axis=0)))
    accuracy = 100 * np.exp(-mfcc_distance / 50)
    
    return min(100, max(0, accuracy))

def compare_audio_files(original_path, user_path, instrument_type):
    y_original, sr_original = load_audio(original_path)
    y_user, sr_user = load_audio(user_path)
    
    features_original = extract_instrument_features(y_original, sr_original, instrument_type)
    features_user = extract_instrument_features(y_user, sr_user, instrument_type)
    
    note_accuracy = compare_pitch(features_original['pitch'], features_user['pitch'])
    tempo_accuracy = compare_tempo(features_original['tempo'], features_user['tempo'])
    rhythm_accuracy = compare_rhythm(features_original['rhythm'], features_user['rhythm'])
    timbre_accuracy = compare_timbre(features_original['timbre'], features_user['timbre'])
    
    overall_accuracy = (note_accuracy + tempo_accuracy + rhythm_accuracy + timbre_accuracy) / 4
    
    return {
        'note_accuracy': round(note_accuracy, 2),
        'tempo_accuracy': round(tempo_accuracy, 2),
        'rhythm_accuracy': round(rhythm_accuracy, 2),
        'timbre_accuracy': round(timbre_accuracy, 2),
        'overall_accuracy': round(overall_accuracy, 2),
        'original_tempo': round(features_original['tempo'], 2),
        'user_tempo': round(features_user['tempo'], 2)
    }
