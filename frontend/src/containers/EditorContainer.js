import { connect } from 'react-redux';

import Editor from '../components/Editor';

const mapStateToProps = (state) => ({
    showRecipePicker: state.recipeAdder.show,
});

export default connect(mapStateToProps)(Editor);
