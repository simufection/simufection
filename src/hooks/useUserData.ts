import React, { useState } from "react";

const useUserData = () => {
    const [userId, setUserId] = useState("");

    return { userId, setUserId }
};

export default useUserData;
