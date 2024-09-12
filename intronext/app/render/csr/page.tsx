"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User { // defines the shape of the user objects
  id: number;
  email: string;
}

const CSRPage: React.FC = () => { // React.FC type definition for functional components in React, It provides built-in typing for props and enforces that the component returns JSX
  const [users, setUsers] = useState<User[]>([]); //initializes users as an empty array and ensures that it will always hold an array of User objects

  useEffect(() => {
    (async ()=>{
        const response = await axios('https://dummyjson.com/users');
        console.log(response);
        setUsers(response.data.users);
    })()
  }, []);

  return (
    <div>
      <h1>Client-Side Rendered Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default CSRPage;