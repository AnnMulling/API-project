import { useParams, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetail } from '../../store/spots';

import CreateSpot from './index';

const EditSpotForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots ? state.spots[spotId] : null);
    const user = useSelector((state) => state.session.user);

    if (!user) {
        history.replace("/")
    }

    useEffect(() => {
        dispatch(fetchSpotDetail(spotId)).catch((e) => history.push('/'));
    }, [dispatch, spotId])

    if (!spot) {
        history.push("/");
        return null
    };

    return (

            <>
                <CreateSpot spot={spot} formType="Update Form"/>
            </>

    );
}

export default EditSpotForm;
