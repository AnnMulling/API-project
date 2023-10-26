import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchSpotDetail } from '../../store/spots';

import CreateSpot from './index';

const EditSpotForm = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots ? state.spots[spotId] : null);

    useEffect(() => {
        dispatch(fetchSpotDetail(spotId))
    }, [dispatch, spotId])

    if (!spot) return (<></>);

    return (
        Object.values(spot).length > 1 && (
            <>
                <CreateSpot
                spot={spot}
                formType="Update Form"
                />
            </>
        )
    );
}

export default EditSpotForm;
