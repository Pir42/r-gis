const patterns = [
    {
        name: 'auto_gentle',
        pad_id: 3,
        color: 3,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'auto_hard',
        pad_id: 4,
        color: 3,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'fade',
        pad_id: 5,
        color: 61,
        controls: {
            pod_1: 'speed',
            pod_2: 'min_brightness',
            pod_3: 'max_brightness',
        },
    },
    ,
    {
        name: 'colors_trans',
        pad_id: 6,
        color: 62,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'strob',
        pad_id: 7,
        color: 1,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'strob_per_seg',
        pad_id: 11,
        color: 1,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'strob_divide',
        pad_id: 12,
        color: 1,
        controls: {
            pod_1: 'speed',
            pod_2: 'divide'
        },
    },
    {
        name: 'worm_reactive',
        pad_id: 13,
        color: 121,
        controls: {
            pod_1: 'speed'
        },
    },
    {
        name: 'worm',
        pad_id: 14,
        color: 52,
        controls: {
            pod_1: 'speed',
            pod_2: 'seg_length',
            pod_3: 'delta'
        },
    },
    {
        name: 'worm_revert',
        pad_id: 15,
        color: 52,
        controls: {
            pod_1: 'speed',
            pod_2: 'seg_length',
            pod_3: 'delta'
        },
    },
    // {
    //     name: 'worm_fill',
    //     pad_id: 15,
    //     color: 52,
    //     controls: {
    //         pod_1: 'speed',
    //         pod_2: 'seg_length',
    //         pod_3: 'delta'
    //     },
    // }
]

module.exports = patterns