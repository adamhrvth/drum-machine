import { useEffect, useState } from "react"
import "./App.css"
import "./PowerSwitch.css"
import "./VolumeSlider.css"

import HEATER_1 from "./audio/Heater-1.mp3"
import HEATER_2 from "./audio/Heater-2.mp3"
import HEATER_3 from "./audio/Heater-3.mp3"
import HEATER_4 from "./audio/Heater-4.mp3"
import CLAP from "./audio/Clap.mp3"
import OPEN_HH from "./audio/Open-HH.mp3"
import KICK_N_HAT from "./audio/Kick_n_Hat.mp3"
import KICK from "./audio/Kick.mp3"
import CLOSED_HH from "./audio/Closed-HH.mp3"

const BLUE = "#2e88d3";
const WHITE = "#fff";
const YELLOW = "#f0ca00";
const BLACK = "#0f0b05";

// constants for keys, audio samples, sample names
const buttonIDs = ["Q", "W", "E", "A", "S", "D", "Y", "X", "C"];

const audioSources = [HEATER_1, HEATER_2, HEATER_3,
                    HEATER_4, CLAP, OPEN_HH,
                    KICK_N_HAT, KICK, CLOSED_HH];

const audioObjects = audioSources.map(sample => new Audio(sample));

const audioStrings = ["HEATER_1", "HEATER_2", "HEATER_3",
                      "HEATER_4", "CLAP", "OPEN_HH",
                      "KICK_N_HAT", "KICK", "CLOSED_HH"];

// get the current sample, and play it.
function startSample(sampleIndex){
  const sampleAudio = audioObjects[sampleIndex];
  sampleAudio.currentTime = 0;
  sampleAudio.play();
}

// choose the clicked/pressed sample
function getSampleIndexByID(id) {                     
  const sampleIndex = buttonIDs.indexOf(id);
  if (sampleIndex !== -1){
    return sampleIndex;
  }
}

function markPressedButton(sampleIndex) {
  highlightButton(buttonIDs[sampleIndex]);              // mark yellow the pressed button
  deHighlightButton(buttonIDs[sampleIndex]);            // set the original button display
}

// highlight button on key press/click
function highlightButton(id) {                         
  const currentButton = document.getElementById(id);
  currentButton.style.backgroundColor = YELLOW;
  currentButton.style.color = BLACK;
}

// dehighlight button after 150ms
function deHighlightButton(id, power) {
  const currentButton = document.getElementById(id);
  setTimeout(() => {
    currentButton.style.backgroundColor = BLUE;
    currentButton.style.color = WHITE;
  }, 150);
}

const Buttons = (props) => {                          // 3x3 grid of buttons

  // choose sample, display it, mark the pressed button and play the sample 
  function onClick(event){
    if(props.power){
      const sampleIndex = getSampleIndexByID(event.target.id);    
      props.setPlayedSampleString(audioStrings[sampleIndex]);     
      markPressedButton(sampleIndex);
      startSample(sampleIndex);            
    }
  }

  return(
    <div id="buttons">
      {buttonIDs.map(id => <button id={id} onClick={onClick}>{id}</button>)}
    </div>
  );
}

const PowerModule = (props) => {

  // switch power off/on and delete the display since there is no currently played sample
  function switchPower(){
    props.setPower(!props.power);
    props.setPlayedSampleString("");
  }
  
  return (
    <div id = "power-module">
      <p>Power</p>
      <label className="switch" id="power-switch">
        <input type="checkbox" id="power" name="power" checked={props.power === true} onChange={switchPower}/>
        <span className="slider"></span>
      </label>
    </div>
  );
}


const Display = (props) => {          // display block for the currently played sample's name
  return(
    <div id="display">
      <p id="sampleString">{props.playedSampleString}</p>
    </div>
  );
}

const VolumeController = (props) => {
  
  // modifying volume level range input's value and setting audio volume level
  function modVolume(event){
    const newVolume = event.target.value;
    props.setVolumeLevel(newVolume);
    audioObjects.map(sample => sample.volume = newVolume);
  }

  return(
    <div id="volume-controller">
      <p>Volume</p>
      <input type="range" id="volume-scrollbar" name="volume-scrollbar" min="0" max="1.0" step="0.05"
      value={props.volumeLevel} onChange={modVolume}/>
    </div>
  );
};

const App = () => {

  // creating state for power, current sample's name and volume
  const [power, setPower] = useState(true);
  const [playedSampleString, setPlayedSampleString] = useState("");
  const [volumeLevel, setVolumeLevel] = useState(0.5);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    }
  });

  // choose sample, set it's name as played, mark the pressed button and play the sample
  function handleKeyPress(event){
    if(power){
      const sampleIndex = getSampleIndexByID(event.key.toUpperCase());
      setPlayedSampleString(audioStrings[sampleIndex]);
      markPressedButton(sampleIndex);
      startSample(sampleIndex);
    } 
  }

  return(
    <div id="drum-machine">
      
      <Buttons power={power} setPlayedSampleString={setPlayedSampleString} />

      <div id="settings">
        
        <PowerModule power={power} setPower={setPower} setPlayedSampleString={setPlayedSampleString} />

        <Display playedSampleString={playedSampleString} />

        <VolumeController volumeLevel={volumeLevel} setVolumeLevel={setVolumeLevel} />

      </div>

    </div>
  );
}

export default App;