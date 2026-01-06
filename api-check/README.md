# Audio Comparison API

## Setup Instructions

1. **Install Python Dependencies**
   ```bash
   cd api-check
   pip install -r requirements.txt
   ```

2. **Run the API Server**
   ```bash
   python main.py
   ```
   The API will start at `http://localhost:5000`

## API Endpoints

### POST /compare
Compares two audio files and returns accuracy metrics.

**Request:**
- `original_file`: Original audio file (WAV, MP3, or FLAC)
- `user_file`: User's audio file (WAV, MP3, or FLAC)
- `instrument`: Instrument type (guitar, piano, vocal, string)

**Response:**
```json
{
  "success": true,
  "instrument": "guitar",
  "results": {
    "note_accuracy": 85.32,
    "tempo_accuracy": 92.15,
    "rhythm_accuracy": 78.45,
    "timbre_accuracy": 88.90,
    "overall_accuracy": 86.21,
    "original_tempo": 120.0,
    "user_tempo": 118.5
  }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "Audio comparison API is running"
}
```

## Features

- **Note Accuracy**: Compares pitch between original and user audio
- **Tempo Accuracy**: Measures tempo matching
- **Rhythm Accuracy**: Analyzes rhythm patterns using DTW
- **Timbre Accuracy**: Compares audio timbre using MFCC features
- **Overall Accuracy**: Average of all metrics

## Supported File Formats
- WAV
- MP3
- FLAC
