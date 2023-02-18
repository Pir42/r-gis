const pod_calc = {
    pod_val_to_exp_brigthness(value) {
        // we work we the exponential from -1 to 1 (so a range of 2)
        // because it's the effect we want
        let exponential_range_value = Math.exp(1) - Math.exp(-1)
        let value_in_range = value * (exponential_range_value) / 127
        return 255*(value_in_range)/(exponential_range_value)
    }
}

module.exports = pod_calc