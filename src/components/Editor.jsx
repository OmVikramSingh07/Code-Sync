import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    // Initialize CodeMirror editor instance once on mount
    useEffect(() => {
        const textarea = document.getElementById("realtimeEditor");
        if (!textarea) return;

        editorRef.current = CodeMirror.fromTextArea(textarea, {
            mode: {
                name: "javascript",
                json: true,
            },
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
            lineWrapping: true,
            tabSize: 4,
        });

        editorRef.current.on("change", (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);

            if (origin !== "setValue" && socketRef.current) {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        });

        return () => {
            if (editorRef.current) {
                editorRef.current.toTextArea();
                editorRef.current = null;
            }
        };
    }, []);

    // Listen for code changes received from socket
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const handleCodeChange = ({ code }) => {
            if (code !== null && code !== undefined && editorRef.current) {
                const currentCode = editorRef.current.getValue();
                if (currentCode !== code) {
                    editorRef.current.setValue(code);
                }
            }
        };

        socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);

        return () => {
            socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
        };
    }, [socketRef.current]);

    return <textarea id="realtimeEditor" defaultValue="" />;
};

export default Editor;