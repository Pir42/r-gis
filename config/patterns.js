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
    {
        name: 'strob_per_seg',
        pad_id: 7,
        color: 1,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'strob_rand',
        pad_id: 11,
        color: 52,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'worm',
        pad_id: 12,
        color: 1,
        controls: {
            pod_1: 'speed',
            pod_2: 'seg_length',
            pod_3: 'delta'
        },
    },
    {
        name: 'worm_revert',
        pad_id: 13,
        color: 52,
        controls: {
            pod_1: 'speed',
            pod_2: 'seg_length',
            pod_3: 'delta'
        },
    },
]

module.exports = patterns