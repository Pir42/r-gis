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
        name: 'strip',
        pad_id: 4,
        color: 52,
        controls: {
            pod_1: 'speed'
        },
    },
    ,
    {
        name: 'x_center',
        pad_id: 5,
        color: 1,
        controls: {
            pod_1: 'speed',
            pod_2: 'revert'
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