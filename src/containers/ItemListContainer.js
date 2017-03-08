import { connect } from 'react-redux';

import { showFloatingElement } from '../actions';

import ItemList from '../components/ItemList';

const mapStateToProps = (state) => ({
    items: state.data.items,
});

const mapDispatchToProps = {
    onDragStart: showFloatingElement,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemList);
