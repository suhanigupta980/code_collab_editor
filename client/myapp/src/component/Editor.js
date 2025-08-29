// import React from 'react'
// import  { useEffect, useRef } from 'react';
// import CodeMirror from "codemirror";
// import 'codemirror/lib/codemirror.css';
// import "codemirror/mode/javascript/javascript";
// import "codemirror/theme/dracula.css";
//  import "codemirror/addon/edit/closetag"; 
//   import "codemirror/addon/edit/closebrackets"; 
  
// //  automatic close bracket
// import "codemirror/lib/codemirror";
// // import CodeMirror from "codemirror";
// function Editor({socketRef,roomId,code}) {
//   const editorRef =useRef(null)

//   useEffect(()=>{
//     const int = async()=>{
//       const editor = CodeMirror.fromTextArea(
//       document.getElementById("realTimeEditor"),
//         {
//           mode: {name:"javascript",json: true},
//           theme: "dracula",
//           autoCloseTags : true,
//           autoCloseBrackets: true,
//           lineNumbers: true,
//         }
//       );
//       editorRef.current=editor;
//       editor.setSize(null,"100%");
//       // editor.current.on('change',(instance ,changes)=>{
//       //   console.log('changes',instance,changes);
//             editor.on("change", (instance, changes) => {
//               const{ origin }=changes;
//               const code =instance.getValue();
//               if(origin !== "setValue"&& socketRef.current){
//                 socketRef.current.emit("code-change",{
//                   roomId,
//                   code,
//                 });
//               }    
//       });
      
//       editorRef.current = editor;
//     };
//     int();
//   },[]);
//   useEffect(()=>{
//     if(socketRef.current){
// socketRef.current.on('code-change',({code})=>{
//         if (code!== null){
//           editorRef.current.setValue(code);
//         }
//       })
//     }
//     // socketRef.current.on("code-change", handleCodeChange);
//           return () =>{
//       if (socketRef.current) {
//         socketRef.current.off("code-change");
//       }
//     };

    
//   },[socketRef])
//   return (
//     <div style={{height: "600%"}}>
//         <textarea  id="realTimeEditor"></textarea>
//       </div>
      
      
    
//   )
// }

// export default Editor
// src/component/Editor.js
import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import axios from "axios";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import ACTIONS from "./actions";
import "codemirror/addon/comment/comment";

// Add the onMount prop here
function Editor({ socketRef, roomId, onCodeChange, onMount }) {
  const editorRef = useRef(null);
  const textAreaRef = useRef(null);
  const runCode = async () => {
    try {
      const response = await axios.post("http://localhost:5000/compile", {
        code: editorRef.current.getValue(), // get code from editor
        languageId: 63, // Node.js (JavaScript) → change if needed
        roomId, // send roomId so output can be broadcasted
      });

      console.log("Output:", response.data.output);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };
  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          extraKeys: {
            "Ctrl-/": "toggleComment",
            "Cmd-/": "toggleComment",
          },
        }
      );

      editor.setSize(null, "100%");
      editorRef.current = editor;

      // Call the onMount function to give the parent access to the editor instance
      if (onMount) {
        onMount(editor);
      }

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    };

    init();
  }, [onMount]); // Added onMount to the dependency array

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          const cursor = editorRef.current.getCursor();
          editorRef.current.setValue(code);
          editorRef.current.setCursor(cursor);
        }
      });
       socketRef.current.on(ACTIONS.OUTPUT_UPDATE, ({ output }) => {
        console.log("Received Output:", output);
        alert("Program Output:\n" + output); // TEMP → show in popup
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div style={{ height: "600px" }}>
      <textarea ref={textAreaRef} id="realtimeEditor"></textarea>

    </div>
  );
}

export default Editor;