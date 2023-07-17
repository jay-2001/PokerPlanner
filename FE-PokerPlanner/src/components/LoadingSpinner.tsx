import '@Styles/LoadingSpinner.css';

/**
 * To show a loading spinner on a component that is loading with api call
 * @returns {JSX.Element}
 */
export default (): JSX.Element => {
  return (
    <div className='spinner-container'>
      <div className='loading-spinner'></div>
    </div>
  );
};
