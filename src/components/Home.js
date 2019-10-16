import React from 'react';

const Home = ({token}) => {
  return (
    <div>
      <h2>This is the home page</h2> 
      <p>Here is your token {token}</p>
    </div>
  );
}

export default Home