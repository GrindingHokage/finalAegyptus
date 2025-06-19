import whisper
import tempfile
import os
import sys
import json
import warnings
import subprocess
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Suppress warnings for cleaner output
warnings.filterwarnings("ignore")

class WhisperService:
    def __init__(self, model_size="base"):
        """Initialize Whisper model"""
        self.model = None
        self.model_size = model_size
        self.supported_formats = ['.wav', '.mp3', '.m4a', '.flac', '.webm', '.mp4']
        self.load_model()
    
    def load_model(self):
        """Load the Whisper model"""
        try:
            logger.info(f"Loading Whisper {self.model_size} model...")
            self.model = whisper.load_model(self.model_size)
            logger.info(f"Whisper {self.model_size} model loaded successfully!")
        except Exception as e:
            logger.error(f"Error loading Whisper model: {e}")
            raise e
    
    def convert_audio_format(self, input_path, output_path):
        """Convert audio to WAV format using ffmpeg if available"""
        try:
            # Check if ffmpeg is available
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            
            # Convert to WAV with 16kHz sample rate, mono channel
            cmd = [
                'ffmpeg', '-i', input_path,
                '-ar', '16000',  # 16kHz sample rate
                '-ac', '1',      # Mono channel
                '-y',            # Overwrite output file
                output_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info(f"Successfully converted audio to WAV format")
                return True
            else:
                logger.warning(f"FFmpeg conversion failed: {result.stderr}")
                return False
                
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger.warning("FFmpeg not available, using original audio file")
            return False
    
    def validate_audio_file(self, audio_path):
        """Validate audio file exists and has reasonable size"""
        if not os.path.exists(audio_path):
            raise ValueError(f"Audio file not found: {audio_path}")
        
        file_size = os.path.getsize(audio_path)
        if file_size == 0:
            raise ValueError("Audio file is empty")
        
        if file_size > 25 * 1024 * 1024:  # 25MB limit
            raise ValueError("Audio file too large (max 25MB)")
        
        logger.info(f"Audio file validated: {file_size} bytes")
        return True
    
    def transcribe_audio(self, audio_path, language=None):
        """Transcribe audio file using Whisper"""
        try:
            # Validate input file
            self.validate_audio_file(audio_path)
            
            # Try to convert to optimal format if ffmpeg is available
            converted_path = None
            if not audio_path.lower().endswith('.wav'):
                converted_path = audio_path.rsplit('.', 1)[0] + '_converted.wav'
                if self.convert_audio_format(audio_path, converted_path):
                    audio_path = converted_path
            
            logger.info(f"Transcribing audio file: {audio_path}")
            
            # Load and preprocess audio
            audio = whisper.load_audio(audio_path)
            audio = whisper.pad_or_trim(audio)
            
            # Create mel spectrogram
            mel = whisper.log_mel_spectrogram(audio, n_mels=self.model.dims.n_mels).to(self.model.device)
            
            # Detect language if not specified
            if not language or language == "auto":
                logger.info("Detecting language...")
                _, probs = self.model.detect_language(mel)
                detected_language = max(probs, key=probs.get)
                confidence = probs[detected_language]
                logger.info(f"Detected language: {detected_language} (confidence: {confidence:.2f})")
            else:
                detected_language = language
                confidence = 0.95
            
            # Set decoding options
            options = whisper.DecodingOptions(
                language=detected_language if detected_language != "auto" else None,
                task="transcribe",
                fp16=False  # Use FP32 for better compatibility
            )
            
            # Decode audio
            logger.info("Decoding audio...")
            result = whisper.decode(self.model, mel, options)
            
            # Clean up the text
            clean_text = result.text.strip()
            
            # Clean up converted file if created
            if converted_path and os.path.exists(converted_path):
                os.unlink(converted_path)
            
            logger.info(f"Transcription successful: '{clean_text[:50]}...'")
            
            return {
                "text": clean_text,
                "language": detected_language,
                "confidence": float(confidence),
                "success": True
            }
            
        except Exception as e:
            logger.error(f"Transcription error: {e}")
            
            # Clean up converted file if created
            if 'converted_path' in locals() and converted_path and os.path.exists(converted_path):
                os.unlink(converted_path)
            
            return {
                "text": "",
                "language": language or "en",
                "confidence": 0.0,
                "success": False,
                "error": str(e)
            }

def main():
    """Main function to handle command line arguments"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No audio file provided", "success": False}))
            return
        
        audio_file = sys.argv[1]
        language = sys.argv[2] if len(sys.argv) > 2 else "auto"
        model_size = sys.argv[3] if len(sys.argv) > 3 else "base"
        
        logger.info(f"Processing: {audio_file}, Language: {language}, Model: {model_size}")
        
        # Initialize Whisper service
        whisper_service = WhisperService(model_size)
        result = whisper_service.transcribe_audio(audio_file, language)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        logger.error(f"Main function error: {e}")
        print(json.dumps({"error": str(e), "success": False}))

if __name__ == "__main__":
    main()
