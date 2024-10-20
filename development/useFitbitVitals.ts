import { useState, useEffect } from 'react';
import { getDateAndWeekAgo, getFitBitVitals, getFitBitVitalsWithRange } from './helper';
import { SleepDataProps, VitalDataProps } from './types';

export const useFitbitVitals = (accessToken: string) => {
    const [fitBitDailySteps, setFitBitDailySteps] = useState<VitalDataProps | null>(null);
    const [fitBitHeartRate, setFitBitHeartRate] = useState<VitalDataProps | null>(null);
    const [fitBitCalories, setFitBitCalories] = useState<VitalDataProps | null>(null);
    const [fitBitSleep, setFitBitSleep] = useState<SleepDataProps | null>(null);

    useEffect(() => {
        const fetchVitals = async () => {
            const { currentDate, weekAgoDate } = getDateAndWeekAgo();
            const dailySteps = await getFitBitVitals(accessToken, currentDate, 'steps');
            const heartRate = await getFitBitVitals(accessToken, currentDate, 'heart');
            const calories = await getFitBitVitals(accessToken, currentDate, 'calories');
            const sleep = await getFitBitVitalsWithRange(accessToken, currentDate, weekAgoDate, 'sleep');

            const heartRateValue = heartRate['activities-heart'][0]?.value.restingHeartRate
                ? heartRate['activities-heart'][0]?.value.restingHeartRate
                : '0';

            const caloriesValue = calories['activities-calories']
                ? calories['activities-calories'][0]?.value
                : '0';

            const sleepValue = sleep['sleep'].length != 0 ? sleep['sleep'][0] : null;

            setFitBitDailySteps({
                identifier: 'dailySteps',
                latestValue: dailySteps?.['activities-steps'][0]?.value || '0',
                name: 'Daily Steps',
                recordDuration: `${currentDate} - ${currentDate}`,
                status: true,
                unit: 'count',
                metaData: dailySteps?.['activities-steps'][0].value,
            });

            setFitBitHeartRate({
                identifier: 'heartRate',
                latestValue: heartRateValue,
                name: 'Heart Rate',
                recordDuration: `${currentDate} - ${currentDate}`,
                status: true,
                unit: 'count/mn',
                metaData: heartRate?.['activities-heart'][0].value,
            });

            setFitBitCalories({
                identifier: 'calorieTracking',
                latestValue: caloriesValue,
                name: 'Calorie Tracking',
                recordDuration: `${currentDate} - ${currentDate}`,
                status: true,
                unit: 'kcal',
                metaData: calories?.['activities-calories'][0]?.value,
            });
            setFitBitSleep({
                identifier: 'sleepAnalysis',
                latestValue: sleepValue,
                name: 'Sleep Analysis',
                recordDuration: `${weekAgoDate} - ${currentDate}`,
                status: true,
                sleepValue: false,
                extra: sleep?.['sleep'],
                metaData: sleep?.['sleep'],
                unit: 'hours'
            });
        };

        if (accessToken) {
            fetchVitals();
        }
    }, [accessToken]);

    return { fitBitDailySteps, fitBitHeartRate, fitBitCalories, fitBitSleep };
};
