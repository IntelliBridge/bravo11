// project imports
import SimpleModal from './SimpleModal';
import ServerModal from './ServerModal';
import MainCard from 'components/ui/cards/MainCard';
import SecondaryAction from 'components/ui/cards/CardSecondaryAction';

// ==============================|| MODAL PAGE ||============================== //

const Modal = () => (
    <MainCard title="Simple Modal" secondary={<SecondaryAction link="https://next.material-ui.com/components/modal/" />}>
        <ServerModal />
        <SimpleModal />
    </MainCard>
);

export default Modal;
