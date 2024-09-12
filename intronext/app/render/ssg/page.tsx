import axios from 'axios';
import React from 'react';

interface User {
  id: number;
  email: string;
}

export default async function Page() {
  // Fetch data at build time
  const response = await axios('https://dummyjson.com/users');
  const users: User[] = response.data.users;

  return (
    <div>
      <h1>Static Site Generated Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}