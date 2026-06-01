"""
Generate WAV sound effect files for the Virtual Manipulative Math game.
Outputs small WAV files in assets/sounds/
"""
import struct
import math
import os

SAMPLE_RATE = 22050
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'assets', 'sounds')

def write_wav(filename, samples, sample_rate=SAMPLE_RATE):
    """Write a list of float samples [-1.0, 1.0] to a 16-bit mono WAV file."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    n = len(samples)
    # Convert to 16-bit PCM
    pcm = b''
    for s in samples:
        val = max(-1.0, min(1.0, s))
        pcm += struct.pack('<h', int(val * 32767))
    
    # WAV header
    data_size = n * 2
    header = struct.pack('<4sI4s', b'RIFF', 36 + data_size, b'WAVE')
    header += struct.pack('<4sIHHIIHH', b'fmt ', 16, 1, 1, sample_rate, sample_rate * 2, 2, 16)
    header += struct.pack('<4sI', b'data', data_size)
    
    with open(filepath, 'wb') as f:
        f.write(header)
        f.write(pcm)
    print(f"  Created: {filepath} ({n} samples, {n/sample_rate:.2f}s)")

def sine_wave(freq, duration, volume=0.3):
    """Generate sine wave samples."""
    n = int(SAMPLE_RATE * duration)
    return [volume * math.sin(2 * math.pi * freq * i / SAMPLE_RATE) for i in range(n)]

def envelope(samples, attack=0.01, release=0.1):
    """Apply attack/release envelope."""
    n = len(samples)
    attack_samples = int(SAMPLE_RATE * attack)
    release_samples = int(SAMPLE_RATE * release)
    result = list(samples)
    for i in range(min(attack_samples, n)):
        result[i] *= i / attack_samples
    for i in range(min(release_samples, n)):
        idx = n - 1 - i
        result[idx] *= i / release_samples
    return result

def mix(list_of_samples):
    """Mix multiple sample lists together."""
    max_len = max(len(s) for s in list_of_samples)
    result = [0.0] * max_len
    for samples in list_of_samples:
        for i, s in enumerate(samples):
            result[i] += s
    # Normalize
    peak = max(abs(s) for s in result) if result else 1
    if peak > 0:
        result = [s / peak * 0.8 for s in result]
    return result

def generate_click():
    """Short click/tap sound."""
    duration = 0.08
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 800 + 400 * math.exp(-t * 30)
        vol = 0.4 * math.exp(-t * 40)
        samples.append(vol * math.sin(2 * math.pi * freq * t))
    return envelope(samples, attack=0.001, release=0.02)

def generate_success():
    """Happy ascending arpeggio (C5-E5-G5-C6)."""
    notes = [523.25, 659.25, 783.99, 1046.50]
    note_dur = 0.12
    gap = 0.08
    all_samples = []
    for i, freq in enumerate(notes):
        offset = int((note_dur + gap) * i * SAMPLE_RATE)
        tone = envelope(sine_wave(freq, note_dur, 0.35), attack=0.005, release=0.06)
        # Pad with offset
        padded = [0.0] * offset + tone
        all_samples.append(padded)
    result = mix(all_samples)
    # Add a shimmer at the end
    shimmer = envelope(sine_wave(1046.50, 0.3, 0.15), attack=0.01, release=0.2)
    total_len = len(result)
    padded_shimmer = [0.0] * total_len + shimmer
    final = mix([result, padded_shimmer])
    return final

def generate_wrong():
    """Descending buzzy tone for wrong answer."""
    duration = 0.3
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 200 - 80 * t
        vol = 0.35 * math.exp(-t * 5)
        # Sawtooth-like
        phase = (freq * t) % 1.0
        samples.append(vol * (2 * phase - 1))
    return envelope(samples, attack=0.005, release=0.08)

def generate_snap():
    """Quick snap/lock sound for puzzle piece snapping."""
    duration = 0.1
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 600 + 800 * math.exp(-t * 25)
        vol = 0.4 * math.exp(-t * 30)
        samples.append(vol * math.sin(2 * math.pi * freq * t))
    return envelope(samples, attack=0.001, release=0.03)

def generate_navigate():
    """Soft whoosh/transition for screen navigation."""
    duration = 0.15
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 400 + 200 * t / duration
        vol = 0.25 * math.sin(math.pi * t / duration)  # Bell curve volume
        samples.append(vol * math.sin(2 * math.pi * freq * t))
    return samples

def generate_complete():
    """Celebratory fanfare for completing a section."""
    # Three note chord: C5 + E5 + G5, then C6
    chord_dur = 0.3
    chord = mix([
        envelope(sine_wave(523.25, chord_dur, 0.3), attack=0.01, release=0.1),
        envelope(sine_wave(659.25, chord_dur, 0.25), attack=0.01, release=0.1),
        envelope(sine_wave(783.99, chord_dur, 0.2), attack=0.01, release=0.1),
    ])
    
    pause = [0.0] * int(SAMPLE_RATE * 0.05)
    
    high_note = envelope(sine_wave(1046.50, 0.4, 0.35), attack=0.01, release=0.25)
    
    return chord + pause + high_note

def generate_measure():
    """Ping sound when measuring a side or angle."""
    duration = 0.12
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 700 + 300 * (1 - t/duration)
        vol = 0.3 * math.exp(-t * 15)
        samples.append(vol * math.sin(2 * math.pi * freq * t))
    # Add a harmonic
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 1400 + 600 * (1 - t/duration)
        vol = 0.15 * math.exp(-t * 20)
        samples[i] += vol * math.sin(2 * math.pi * freq * t)
    return envelope(samples, attack=0.001, release=0.04)

def generate_bgm():
    """Simple looping background melody (short, cheerful, loopable)."""
    # Simple C major melody: C4-E4-G4-C5-G4-E4 pattern
    melody_notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 329.63]
    note_dur = 0.25
    all_parts = []
    
    for i, freq in enumerate(melody_notes):
        offset = int(note_dur * i * SAMPLE_RATE)
        # Main tone (softer for background)
        tone = envelope(sine_wave(freq, note_dur * 0.9, 0.12), attack=0.01, release=0.08)
        # Add subtle harmony (fifth above, very quiet)
        harmony = envelope(sine_wave(freq * 1.5, note_dur * 0.9, 0.04), attack=0.01, release=0.08)
        combined = [t + h for t, h in zip(tone, harmony)]
        padded = [0.0] * offset + combined
        all_parts.append(padded)
    
    return mix(all_parts)


if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Generating sound effects...")
    
    write_wav('click.wav', generate_click())
    write_wav('success.wav', generate_success())
    write_wav('wrong.wav', generate_wrong())
    write_wav('snap.wav', generate_snap())
    write_wav('navigate.wav', generate_navigate())
    write_wav('complete.wav', generate_complete())
    write_wav('measure.wav', generate_measure())
    write_wav('bgm.wav', generate_bgm())
    
    print("\nAll sound effects generated successfully!")
