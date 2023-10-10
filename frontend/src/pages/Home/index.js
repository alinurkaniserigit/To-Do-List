import React, { useContext, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Slider from 'react-slick'; // Import the Slider component from react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UserContext } from '../../contexts';

// Home page
function Home() {
  const { user, setUser } = useContext(UserContext);
  const [randomPictures, setRandomPictures] = useState([]);

  useEffect(() => {
    // Fetch random pictures from the specified API
    fetchRandomPictures().then((pictures) => {
      setRandomPictures(pictures);
    });
  }, []);

  // Function to fetch random pictures
  const fetchRandomPictures = async () => {
    try {
      // Fetch random pictures from the specified API
      const response = await fetch('https://random.imagecdn.app/500/150');
      if (!response.ok) {
        throw new Error('Failed to fetch random pictures');
      }
      const data = await response.json();
      // Ensure that the API response structure is an array of image URLs
      return [data]; // Wrap the API response in an array if it's not already an array
    } catch (error) {
      console.error('Error fetching random pictures:', error);
      return [];
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <Typography id="modal-modal-title" variant="h4" component="h2">
        Welcome, {user.user.name}!
      </Typography>

      {/* Slider */}
      <Slider {...settings}>
        {randomPictures.map((pictureUrl, index) => (
          <div key={index}>
            <img src={pictureUrl} alt={`Random ${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Home;
