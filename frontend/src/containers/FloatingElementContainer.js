import { connect } from 'react-redux';
import _ from 'lodash';
import FloatingElement from '../components/FloatingElement';

const mapStateToProps = (state) => ({
    x: state.floatingElement.x,
    y: state.floatingElement.y,
    icon: _.find(state.data.items, (i) => state.floatingElement.item === i.name).icon,
});

export default connect(mapStateToProps)(FloatingElement);
