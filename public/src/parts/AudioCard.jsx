/** @format */
import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { audioUpdateLink, updateUserLink } from "../../api";
import AddTaskIcon from "@mui/icons-material/AddTask";
const AudioContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  padding: 0rem 1rem;
  border: 2px solid #3a3a3a;
  background-color: #3a3a3a;
  width: 90vw;
  div {
    width : 30%;
    color: white !important;
    a{
      color : white !important;
      margin: 0 10px;
    }
  }
`;

const MidSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 40vw;
`;

const CommentBox = styled.div`
  display: flex;
  width: 30%;
  input{
    width: 90%;
    padding: 2px 5px;
  }
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  width: 30vw;
  max-height: 70vh;
  background-color: #3a3a3a;
  position: absolute;
  bottom: 60px;
  padding: 5px 10px;
  div{
    width: 100%;
    display: flex !important;
  }
`

const AudioCard = ({ file, userData, projectLimit }) => {
  let [link, setLink] = useState(file.audioFileLink);
  let [modalVisible, setModalVisible] = useState();
  let [comment, setComment] = useState("");
  let [count, setCount] = useState(0);

  useEffect(()=>{
    setLink(file.audioFileLink);
    console.log(file.audioFileLink, link);
  }, [file.audioFileLink])
  useEffect(()=>{
    // alert("Loading Your Audio, kindly wait patiently... or try refreshing...")
    let ind = file.plays.findIndex(
      (item) => item.userName === userData.userName
    );
    if (ind !== -1) {
      setCount(file.plays[ind].plays);
      console.log(file.plays[ind].plays)
    }
    else setCount(0);

  }, [file._id]);

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
        console.log(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };
  const updateUser = () => {
    console.log(file._id);
      if (!userData.audioPlayed.includes(file._id)) {
        userData.audioPlayed.push(file._id);
      }
      const postData = {
        id: userData._id,
        audioPlayed: userData.audioPlayed,
      };
      console.log(postData);
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
          console.log(data);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
  };
  const countTracker = () => {
    let ind = file.plays.findIndex(
      (item) => item.userName === userData.userName
    );

    if (ind !== -1) {
      file.plays[ind].plays++;
      setCount(file.plays[ind].plays )
    } else {
      file.plays.push({ userName: userData.userName, plays: 1 });
      setCount(1);
    }

    updateAudio();
    updateUser();
    console.log(file.plays, count, projectLimit);
  };

  const commentTracker = (val) => {
    let ind = file.comments.findIndex(
      (item) => item.userName === userData.userName
    );
    if (ind !== -1) {
      file.comments[ind].comment = val;
    } else {
      file.comments.push({ userName: userData.userName, comment : val});
    }
    updateAudio();

  }
   const handleContextMenu = (e) => {
     e.preventDefault();
   }

  return (
    <AudioContainer>
      <div>
        <div>
           {file.fileName}
        </div>
       {"|"} {`Plays : ${count}/${projectLimit} `}{"|"}
        <a
          href="#"
          onClick={() => setModalVisible(!modalVisible)}>
          See All Details
        </a>
      </div>
      {modalVisible && (
        <Modal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}>
          <div>Unique Id : {file.uniqueId}</div>
          <div>FileName : {file.fileName} </div>
          <div>Name : {file.name} </div>
          <div>Age : {file.age} </div>
          <div>Gender : {file.gender} </div>
        </Modal>
      )}
      {count > projectLimit && (
        <MidSection>
          you have reached the limit to play this audio, please contact the
          admin for furthur chances !!!
        </MidSection>
      )}
      {count <= projectLimit && (
        <MidSection>
          <audio
            key={file._id}
            controls
            controlsList="nodownload"
            onContextMenu={handleContextMenu}
            onPlay={() => countTracker()}
            onPause={() =>
              alert(
                "Audio successfully paused, caution : each time you play your play count decreases..."
              )
            }
            onEnded={() => console.log("Audio has ended")}
            onError={(error) => alert("Server Error! try refreshing")}>
            <source
              src={file.audioFileLink}
              type="audio/mp3"
            />
            Your browser does not support the audio tag.
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
        <AddTaskIcon onClick={() => commentTracker(comment)} />
      </CommentBox>
    </AudioContainer>
  );
};

export default AudioCard;
