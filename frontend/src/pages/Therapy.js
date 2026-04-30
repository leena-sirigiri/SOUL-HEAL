import { useEffect, useRef, useState } from "react";
import {
  getStoredUserProfile,
  profileOptions,
  saveUserProfile,
} from "../utils/profileStorage";

const soundDescriptions = {
  Ocean: "Wide, slow waves for grounding and deep breathing.",
  Waterfall: "Steady flowing water for focus and emotional release.",
  Rain: "Soft rainfall that helps quiet busy thoughts.",
  Forest: "Gentle breeze and birds for a lighter reset.",
};

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let index = 0; index < channelData.length; index += 1) channelData[index] = Math.random() * 2 - 1;
  return buffer;
}

function startAmbientEngine(type) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextClass();
  const master = context.createGain();
  const nodes = [];

  master.gain.value = 0.0001;
  master.connect(context.destination);
  master.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 1.2);

  const addNoiseLayer = ({ filterType = "lowpass", frequency = 800, q = 0.4, gain = 0.18, playbackRate = 1 }) => {
    const source = context.createBufferSource();
    source.buffer = createNoiseBuffer(context);
    source.loop = true;
    source.playbackRate.value = playbackRate;
    const filter = context.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const layerGain = context.createGain();
    layerGain.gain.value = gain;
    source.connect(filter);
    filter.connect(layerGain);
    layerGain.connect(master);
    source.start();
    nodes.push(source);
    return layerGain;
  };

  const addOscillator = ({ type: wave = "sine", frequency, gain = 0.02 }) => {
    const oscillator = context.createOscillator();
    const oscillatorGain = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.value = frequency;
    oscillatorGain.gain.value = gain;
    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(master);
    oscillator.start();
    nodes.push(oscillator);
    return oscillatorGain;
  };

  if (type === "Ocean") {
    const base = addNoiseLayer({ filterType: "lowpass", frequency: 420, gain: 0.18 });
    const wash = addNoiseLayer({ filterType: "bandpass", frequency: 260, q: 0.5, gain: 0.12, playbackRate: 0.92 });
    const waveLfo = context.createOscillator();
    const waveDepth = context.createGain();
    waveLfo.frequency.value = 0.12;
    waveDepth.gain.value = 0.05;
    waveLfo.connect(waveDepth);
    waveDepth.connect(base.gain);
    waveDepth.connect(wash.gain);
    waveLfo.start();
    nodes.push(waveLfo);
  }

  if (type === "Waterfall") {
    addNoiseLayer({ filterType: "highpass", frequency: 900, gain: 0.12, playbackRate: 1.08 });
    addNoiseLayer({ filterType: "bandpass", frequency: 1500, q: 0.6, gain: 0.14 });
    addNoiseLayer({ filterType: "lowpass", frequency: 4200, gain: 0.08, playbackRate: 0.96 });
  }

  if (type === "Rain") {
    const rainBed = addNoiseLayer({ filterType: "highpass", frequency: 2200, gain: 0.09 });
    const drift = context.createOscillator();
    const driftDepth = context.createGain();
    drift.frequency.value = 0.26;
    driftDepth.gain.value = 0.03;
    drift.connect(driftDepth);
    driftDepth.connect(rainBed.gain);
    drift.start();
    nodes.push(drift);
    addNoiseLayer({ filterType: "bandpass", frequency: 4800, q: 1.3, gain: 0.06, playbackRate: 1.18 });
  }

  if (type === "Forest") {
    addNoiseLayer({ filterType: "lowpass", frequency: 620, gain: 0.1, playbackRate: 0.82 });
    addNoiseLayer({ filterType: "bandpass", frequency: 1200, q: 0.9, gain: 0.05 });
    const birdOne = addOscillator({ type: "triangle", frequency: 880, gain: 0.012 });
    const birdTwo = addOscillator({ type: "sine", frequency: 1320, gain: 0.008 });
    const flutter = context.createOscillator();
    const flutterGain = context.createGain();
    flutter.frequency.value = 0.45;
    flutterGain.gain.value = 0.01;
    flutter.connect(flutterGain);
    flutterGain.connect(birdOne.gain);
    flutterGain.connect(birdTwo.gain);
    flutter.start();
    nodes.push(flutter);
  }

  return {
    stop: async () => {
      try {
        master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
        window.setTimeout(() => {
          nodes.forEach((node) => {
            if (typeof node.stop === "function") {
              try { node.stop(); } catch { return; }
            }
          });
        }, 350);
        window.setTimeout(() => { context.close().catch(() => {}); }, 450);
      } catch {
        context.close().catch(() => {});
      }
    },
  };
}

function Therapy() {
  const [profile, setProfile] = useState(getStoredUserProfile());
  const [playing, setPlaying] = useState("");
  const [breathStep, setBreathStep] = useState("Inhale");
  const audioEngineRef = useRef(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setBreathStep((current) => (current === "Inhale" ? "Hold" : current === "Hold" ? "Exhale" : "Inhale"));
    }, 4000);

    return () => {
      window.clearInterval(interval);
      audioEngineRef.current?.stop();
    };
  }, []);

  const playSound = async (soundName) => {
    audioEngineRef.current?.stop();
    audioEngineRef.current = startAmbientEngine(soundName);
    setPlaying(soundName);
    const nextProfile = saveUserProfile({ preferredSound: soundName });
    setProfile(nextProfile);
  };

  const stopSound = () => {
    audioEngineRef.current?.stop();
    audioEngineRef.current = null;
    setPlaying("");
  };

  return (
    <div style={container}>
      <div style={heroCard}>
        <p style={eyebrow}>THERAPY SPACE</p>
        <h2 style={{ margin: "6px 0" }}>Calm without extra scrolling</h2>
        <p style={heroText}>
          Use the floating Swap button anytime, and keep your favorite sound saved
          to your profile.
        </p>
      </div>

      <div style={panel}>
        <div style={panelHeader}>
          <h3 style={{ margin: 0 }}>Ambient Sound Therapy</h3>
          <span style={statusPill(playing)}>
            {playing ? `Playing ${playing}` : `Saved favorite: ${profile.preferredSound}`}
          </span>
        </div>

        <div style={soundGrid}>
          {profileOptions.map((soundName) => (
            <button key={soundName} style={soundCard(playing === soundName || profile.preferredSound === soundName)} onClick={() => playSound(soundName)}>
              <strong>{soundName}</strong>
              <span style={soundText}>{soundDescriptions[soundName]}</span>
            </button>
          ))}
        </div>

        {playing && <button style={stopBtn} onClick={stopSound}>Stop sound</button>}
      </div>

      <div style={panel}>
        <h3 style={{ marginTop: 0 }}>Breathing Reset</h3>
        <div className="breath-circle"></div>
        <p style={breathCopy}>{breathStep} slowly and let your shoulders soften.</p>
      </div>

      <div style={panel}>
        <h3 style={{ marginTop: 0 }}>Quick Relief Tools</h3>
        <div style={tipList}>
          <TipCard title="5-second reset" text="Relax your jaw, unclench your hands, and exhale longer than you inhale." />
          <TipCard title="Grounding cue" text="Name 3 things you can see, 2 things you can hear, and 1 thing you can feel." />
          <TipCard title="Gentle reminder" text="You are allowed to pause without needing to earn it first." />
        </div>
      </div>
    </div>
  );
}

function TipCard({ title, text }) {
  return (
    <div style={tipCard}>
      <strong>{title}</strong>
      <p style={{ margin: "8px 0 0", color: "#4b647e", lineHeight: 1.55 }}>{text}</p>
    </div>
  );
}

const container = { padding: "22px 18px 110px", maxWidth: "440px", margin: "auto", minHeight: "100vh", background: "radial-gradient(circle at top, #d8f6ff, #f5fbff 48%, #ecfff4 100%)", color: "#0f2940" };
const heroCard = { padding: "22px", borderRadius: "30px", background: "linear-gradient(145deg, #0ea5e9, #14b8a6)", color: "#effffb", boxShadow: "0 22px 46px rgba(14, 165, 233, 0.24)" };
const eyebrow = { margin: 0, fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.9 };
const heroText = { margin: "10px 0 0", lineHeight: 1.65 };
const panel = { marginTop: "18px", padding: "20px", borderRadius: "24px", background: "rgba(255,255,255,0.95)", boxShadow: "0 18px 36px rgba(15, 23, 42, 0.08)", border: "1px solid rgba(219,234,254,0.8)" };
const panelHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "14px" };
const statusPill = (playing) => ({ padding: "8px 12px", borderRadius: "999px", background: playing ? "#dcfce7" : "#e0f2fe", color: playing ? "#166534" : "#0c4a6e", fontWeight: 700, fontSize: "12px" });
const soundGrid = { display: "grid", gap: "12px" };
const soundCard = (active) => ({ display: "flex", flexDirection: "column", gap: "8px", padding: "16px", borderRadius: "20px", border: active ? "2px solid #22c55e" : "1px solid #dbeafe", cursor: "pointer", textAlign: "left", background: active ? "linear-gradient(145deg, #effdf5, #d9f99d)" : "#f8fbff", color: "#0f2940" });
const soundText = { fontSize: "13px", lineHeight: 1.5, color: "#4b647e" };
const stopBtn = { marginTop: "14px", width: "100%", padding: "13px", borderRadius: "16px", border: "none", background: "#ef4444", color: "#fff", fontWeight: 800, cursor: "pointer" };
const breathCopy = { margin: "10px 0 0", textAlign: "center", color: "#40607d" };
const tipList = { display: "grid", gap: "12px" };
const tipCard = { padding: "16px", borderRadius: "18px", background: "#f8fbff", border: "1px solid #dbeafe" };

export default Therapy;
