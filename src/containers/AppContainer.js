import { connect } from 'react-redux';

import App from '../components/App';

const mapStateToProps = (state) => ({
    showFloatingElement: state.floatingElement.show,
});

export default connect(mapStateToProps)(App);
