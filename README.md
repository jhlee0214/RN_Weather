# React Native Weather App

A simple and modern React Native weather application built with Expo. It allows users to:

- View weather information for their current location
- Search for any city worldwide using a modal with autocomplete suggestions
- Instantly switch back to their current location's weather

## Features

- **Current Location Weather**: Fetches and displays weather data based on the user's device location.
- **City Search Modal**: Search for any city using a modal popup with real-time suggestions (powered by OpenWeatherMap Geocoding API).
- **Switch Location**: Easily toggle between searched cities and your current location with dedicated icon buttons.
- **Modern UI**: Clean, mobile-friendly interface with weather icons and detailed forecast info.

## Screenshots

![App Screenshot](screenshot.png)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory:
     ```env
     GOOGLE_LOCATION_API_KEY=your_google_api_key
     WEATHER_API_KEY=your_openweathermap_api_key
     ```
   - **Note:** `.env` is gitignored and will not be committed.

4. **Start the app:**
   ```bash
   npx expo start
   ```

## Environment Variables
- `GOOGLE_LOCATION_API_KEY`: Google Maps Geocoding API key (for reverse geocoding coordinates to city names)
- `WEATHER_API_KEY`: OpenWeatherMap API key (for weather and city search)

## Usage
- On launch, the app requests location permission and shows your local weather.
- Tap the **search icon** next to the city name to open the city search modal.
- Type a city name (e.g., "seo") to see suggestions. Select a city to view its weather.
- Tap the **location pin icon** to return to your current location's weather.

## Dependencies
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview)
- [@expo/vector-icons](https://docs.expo.dev/guides/icons/)
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)

## License

This project is licensed under the MIT License. 