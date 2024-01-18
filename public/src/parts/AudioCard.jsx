/** @format */
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { audioUpdateLink, updateUserLink } from "../../api";
import AddTaskIcon from "@mui/icons-material/AddTask";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Button, Slider } from "@mui/material";

const AudioContainer = styled.div`
  height: 4rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5rem;
  padding: 10px 3rem;
  border-top: 3px solid #3a3a3a;
  position: relative;
`;

const MidSection = styled.div`
  width: 30%;
  text-align: center;
`;

const CommentBox = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  gap: 1rem;
  input {
    width: 95%;
    border: 0;
    outline: 0;
    border-bottom: 1px solid blue;
  }
`;

const Modal = styled.div`
  width: 30%;
  position: absolute;
  bottom: 4rem;
  text-align: left;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #3a3a3a;
  color: #fff;
  border-radius: 4px;
`;

const AudioCard = ({ file, userData, projectLimit }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [audioAllow, setAudioAllow] = useState(true);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [link, setLink] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    let ind = file.plays.findIndex(
      (item) => item.userName === userData.userName
    );
    if (ind !== -1) {
      setCount(file.plays[ind].plays);
      if (file.plays[ind].plays >= projectLimit) setAudioAllow(false);
      else setAudioAllow(true);
    } else {
      setCount(0);
      setAudioAllow(true);
    }
    setLink(file.audioFileLink);
    setIsPlaying(false);
  }, [file._id]);

  useEffect(() => {
    setIsPlaying(false);
  }, [link]);

  const updateAudio = () => {
    const postData = {
      id: file._id,
      data: file,
    };
    fetch(audioUpdateLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.response);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const updateUser = () => {
    if (!userData.audioPlayed.includes(file._id)) {
      userData.audioPlayed.push(file._id);
    }
    const postData = {
      id: userData._id,
      audioPlayed: userData.audioPlayed,
    };
    fetch(updateUserLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const countTracker = () => {
    if (count >= projectLimit) setAudioAllow(false);
    else {
      let ind = file.plays.findIndex(
        (item) => item.userName === userData.userName
      );
      if (ind !== -1) {
        file.plays[ind].plays++;
        setCount(file.plays[ind].plays);
      } else {
        file.plays.push({ userName: userData.userName, plays: 1 });
        setCount(1);
      }
      updateAudio();
      updateUser();
    }
  };

  const commentTracker = (val) => {
    let ind = file.comments.findIndex(
      (item) => item.userName === userData.userName
    );
    if (ind !== -1) {
      file.comments[ind].comment = val;
    } else {
      file.comments.push({ userName: userData.userName, comment: val });
    }
    updateAudio();
    setComment("");
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const currentProgress =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setSliderValue(currentProgress);
  };

  const handleRangeChange = (e, value) => {
    setSliderValue(value);
    const newProgress = parseFloat(value);
    const newTime = (newProgress / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <AudioContainer onContextMenu={handleContextMenu}>
      <div>
        <div>{file.fileName}</div>
        {"|"} {`Plays : ${count}/${projectLimit} `}
        {"|"}
        <Button onClick={() => setModalVisible(!modalVisible)}>
          See All Details
        </Button>
      </div>
      {modalVisible && (
        <Modal>
          <div>Unique Id : {file.uniqueId}</div>
          <div>FileName : {file.fileName} </div>
          <div>Name : {file.name} </div>
          <div>Age : {file.age} </div>
          <div>Gender : {file.gender} </div>
        </Modal>
      )}
      {!audioAllow && (
        <MidSection>
          You have reached the limit to play this audio, please contact the
          admin for further chances!!!
        </MidSection>
      )}
      {audioAllow && (
        <MidSection>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Button onClick={handlePlayPause}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>
            <Slider
              value={sliderValue}
              onChange={handleRangeChange}
            />
          </div>
          <audio
            ref={audioRef}
            onPlay={countTracker}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            key={link} // Added key prop to force re-render
          >
            <source
              src={link}
              type="audio/mp3"
            />
            Your browser does not support the audio element.
          </audio>
        </MidSection>
      )}
      <CommentBox>
        <input
          type="text"
          placeholder="Type Your Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={() => commentTracker(comment)}>
          <AddTaskIcon />
        </Button>
      </CommentBox>
    </AudioContainer>
  );
};

export default AudioCard;
