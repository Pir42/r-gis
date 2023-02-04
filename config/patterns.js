const patterns = [
    {
        name: 'auto',
        pad_id: 3,
        color: 1,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'fade',
        pad_id: 4,
        color: 52,
        controls: {
            pod_1: 'speed',
            pod_2: 'min_brightness',
            pod_3: 'max_brightness',
        },
    },
    ,
    {
        name: 'colors',
        pad_id: 5,
        color: 1,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'strob',
        pad_id: 6,
        color: 52,
        controls: {
            pod_1: 'speed'
        },
    },
]

module.exports = patterns