import { Oval } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#1a2a6c'
    }}>
      <Oval
        height={80}
        width={80}
        color="#f39c12"
        secondaryColor="#2ecc71"
        ariaLabel="loading"
        strokeWidth={5}
      />
      <p style={{ color: 'white', marginTop: '20px' }}>
        Loading...
      </p>
    </div>
  );
};

export default Loader;