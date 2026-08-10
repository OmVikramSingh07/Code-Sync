import React from "react";
import Avatar from "react-avatar";

const Client = ({ username }) => {
    return (
        <div className="clientCard">
            <div className="avatarWrapper">
                <Avatar
                    name={username}
                    size="40"
                    round="10px"
                    textSizeRatio={2}
                />
                <span className="onlineBadge" />
            </div>
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;





