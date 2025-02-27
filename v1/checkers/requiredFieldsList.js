const userRequiredFields = [
    'email',
    'password',
    'firstname',
    'lastname',
    'status'
];

const boatRequiredFields = [
    'name',
    'description',
    'boat_type',
    'picture',
    'licence_type',
    'bail',
    'city',
    'longitude',
    'latitude',
    'motor_type',
    'motor_power'
];

const fishingLogRequiredFields = [
    'fish_name',
    'picture',
    'comment',
    'weight',
    'height',
    'location',
    'date',
    'freed'
];

const fishingTripRequiredFields = [
    'information',
    'type',
    'price',
    'cost_type',
    'begin_date',
    'end_date',
    'begin_time',
    'end_time'
];

const reservationRequiredFields = [
    'price',
    'nb_places'
];

module.exports = { boatRequiredFields, fishingLogRequiredFields, fishingTripRequiredFields, reservationRequiredFields, userRequiredFields };