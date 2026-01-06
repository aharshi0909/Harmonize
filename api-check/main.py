from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from fn import compare_audio_files

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'flac'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/compare', methods=['POST'])
def compare_songs():
    try:
        print("Received request to /compare")
        
        if 'original_file' not in request.files or 'user_file' not in request.files:
            print("Missing files in request")
            return jsonify({'error': 'Both original and user audio files are required'}), 400
        
        original_file = request.files['original_file']
        user_file = request.files['user_file']
        instrument = request.form.get('instrument', 'guitar')
        
        print(f"Processing files: {original_file.filename}, {user_file.filename}, instrument: {instrument}")
        
        if original_file.filename == '' or user_file.filename == '':
            print("Empty filename")
            return jsonify({'error': 'No selected file'}), 400
        
        if not (allowed_file(original_file.filename) and allowed_file(user_file.filename)):
            print("Invalid file format")
            return jsonify({'error': 'Invalid file format. Only WAV, MP3, and FLAC are allowed'}), 400
        
        original_filename = secure_filename(original_file.filename)
        user_filename = secure_filename(user_file.filename)
        
        original_path = os.path.join(app.config['UPLOAD_FOLDER'], f'original_{original_filename}')
        user_path = os.path.join(app.config['UPLOAD_FOLDER'], f'user_{user_filename}')
        
        print(f"Saving files to: {original_path}, {user_path}")
        original_file.save(original_path)
        user_file.save(user_path)
        
        print("Starting audio comparison...")
        result = compare_audio_files(original_path, user_path, instrument)
        print(f"Comparison complete: {result}")
        
        try:
            os.remove(original_path)
            os.remove(user_path)
            print("Cleanup complete")
        except Exception as e:
            print(f"Error removing files: {e}")
        
        return jsonify({
            'success': True,
            'instrument': instrument,
            'results': result
        })
    
    except Exception as e:
        import traceback
        error_msg = str(e)
        trace = traceback.format_exc()
        print(f"ERROR: {error_msg}")
        print(f"TRACEBACK:\n{trace}")
        return jsonify({'error': error_msg, 'traceback': trace}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Audio comparison API is running'})

if __name__ == '__main__':
    print("Starting Audio Comparison API on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
