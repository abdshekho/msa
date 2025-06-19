//@ts-nocheck
'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { use, useEffect, useState } from 'react';
import { FaAlignLeft, FaCalculator, FaCarBattery, FaListUl, FaLockOpen, FaPlus, FaSolarPanel } from 'react-icons/fa';
import { redirect, usePathname } from 'next/navigation';
import { BsDeviceSsd } from 'react-icons/bs';
import { GiSolarPower } from 'react-icons/gi';
import { set } from 'cypress/types/lodash';
import { getClientDictionary } from '@/get-dictionary-client';

const deviceOptions = [
    { name: 'نيون', wattage: 40 },
    { name: 'براد', wattage: 150 },
    { name: 'براد قياس11 - 15قدم', wattage: 150 },
    { name: 'مروحة', wattage: 75 },
];

// Create schema using dictionary for validation messages
const createSchema = (lang: string, dictionary: any) => {
    // Get error messages from dictionary
    const errorMessages = dictionary.error['solar-calculator'];
    
    return z.object({
        devices: z.array(z.object({
            name: z.string().min(1, errorMessages['name-required']),
            wattage: z.coerce.number()
                .min(1, errorMessages['wattage-min'])
                .max(10000, errorMessages['wattage-max']),
            count: z.coerce.number()
                .min(1, errorMessages['count-min'])
                .max(99, errorMessages['count-max']),
            morning: z.coerce.number()
                .min(0, errorMessages['morning-min'])
                .max(15, errorMessages['morning-max']),
            evening: z.coerce.number()
                .min(0, errorMessages['evening-min'])
                .max(15, errorMessages['evening-max']),
            isCustom: z.boolean().optional()
        })),
    });
};

// Define the FormData type structure
type FormData = {
    devices: {
        name: string;
        wattage: number;
        count: number;
        morning: number;
        evening: number;
        isCustom?: boolean;
    }[];
};

export default function SolarCalculator() {
    const pahtname = usePathname()
    const lang = pahtname.slice(1, 3) || 'en';
    const dict = getClientDictionary(lang);
    
    // Create schema with the current language and dictionary
    const schema = createSchema(lang, dict);
    
    const { control, register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            devices: [
                { name: '', wattage: 0, count: 1, morning: 6, evening: 6, isCustom: false }
            ]
        },
        resolver: zodResolver(schema),
    });
    function conditionalRound(number: number): number {
        if (isNaN(number)) {
            throw new Error('Input must be a valid number');
        }

        const decimal = number - Math.floor(number);

        return decimal >= 0.3
            ? Math.max(1, Math.ceil(number))
            : Math.max(1, Math.floor(number));
    }
    const handleRemove = (index) => {
        const d = document.getElementsByClassName('row-' + index)[0];
        d.classList.toggle('opacityfull')
        d.classList.toggle('opacityhidden')
        console.log(d);
        setTimeout(() => {
            remove(index)
        }, 500)
    }
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'devices'
    });

    const devices = watch('devices');
    const [submited, setSubmited] = useState(false);
    const [voltageBattery, setVoltageBattery] = useState(12.5);
    const [voltagePanel, setVoltagePanel] = useState(705);
    const [capacityInverter, setCapacityInverter] = useState(0);
    const hadnelEditDevices = () => {
        setSubmited(false)
        setVoltageBattery(12.5);
        setVoltagePanel(705);
        setCapacityInverter(0);
        setOutputValue({
            nPanel: 0,
            nBattery: 0,
            cInverter: 0
        })
    }

    const [outputValue, setOutputValue] = useState({
        nPanel: 0,
        nBattery: 0,
        cInverter: 0
    });
    const handelVotageBatttery = (e) => {
        const oldValue = voltageBattery;
        const newValue = parseFloat(e.target.value);

        if (newValue && oldValue && outputValue.nBattery > 0) {
            setOutputValue((prev) => {
                return {
                    nPanel: prev.nPanel,
                    nBattery: (prev.nBattery * oldValue) / newValue,
                    cInverter: prev.cInverter
                }
            });
        }
        setVoltageBattery(newValue);
    }
    const handelVotagePanel = (e) => {

        // console.log('🚀 ~ page.tsx ~ handelVotagePanel ~ e:', e.target.value);
        // if(!e.target.value) return
        const oldValue = voltagePanel;
        const newValue = parseFloat(e.target.value);

        if (newValue && oldValue && outputValue.nPanel > 0) {
            setOutputValue((prev) => {
                return {
                    nPanel: (prev.nPanel * oldValue) / newValue,
                    nBattery: prev.nBattery,
                    cInverter: prev.cInverter
                }
            });
        }
        setVoltagePanel(newValue);
    }

    const onSubmit = (data: FormData) => {
        setSubmited(true);

        // to inverter
        const total = data.devices.reduce((acc, d) => {
            return acc + (d.count * d.wattage);
        }, 0);
        const totalMorning = data.devices.reduce((acc, d) => {
            return acc + (d.count * d.wattage * (d.morning));
        }, 0);
        const totalEvening = data.devices.reduce((acc, d) => {
            return acc + (d.count * d.wattage * (d.evening));
        }, 0);
        const capacityOfBattery = totalEvening / 0.8
        // 12.5 voltage of battery
        let NumberOfBattery = 0;
        const capacityInverter = total * 1.7;
        if (capacityInverter < 1600) {
            NumberOfBattery = capacityOfBattery / 12.5 / 1000 / 0.7
            setVoltageBattery(12.5);

        } else if ((capacityInverter > 1600) && (capacityInverter < 3100)) {
            NumberOfBattery = capacityOfBattery / 24 / 1000 / 0.7
            setVoltageBattery(24);

        } else if (capacityInverter > 3100) {
            setVoltageBattery(48);
            NumberOfBattery = capacityOfBattery / 48 / 1000 / 0.7
        }


        // 705 is watt of panel
        const NumberOfPanel = (capacityOfBattery + totalMorning) / 4.8 / voltagePanel / 0.8
        setOutputValue({
            nPanel: NumberOfPanel,
            nBattery: NumberOfBattery,
            cInverter: total * 1.7
        })
        alert(`
                total watt: ${total}
                totalMornign: ${totalMorning}
                total evenign: ${totalEvening}
                total: ${totalMorning + totalEvening}
                capacity of battary: ${capacityOfBattery}
                Number of battary: ${NumberOfBattery}
                Number of Panel: ${NumberOfPanel}
            `);
        redirect('#output1')
    };


    useEffect(() => {
        devices.forEach((d, i) => {
            if (!d.isCustom) {
                const selectedOption = deviceOptions.find(opt => opt.name === d.name);
                if (selectedOption && d.wattage !== selectedOption.wattage) {
                    const initialDevice = fields[i];
                    const justChangedName = initialDevice?.name !== d.name;
                    if (justChangedName) {
                        setValue(`devices.${i}.wattage`, selectedOption.wattage);
                        trigger(`devices.${i}.wattage`)
                    }
                }
            }
        });
    }, [devices.map(d => d.name).join(','), fields.map(f => f.name).join(','), setValue]);

    return (
        <div className='p-2 sm:p-6 max-w-7xl mx-auto space-y-4 text-black dark:text-white mt-10 bg-gray-50 dark:bg-gray-700 rounded-2xl'>
            <form onSubmit={ handleSubmit(onSubmit) } className="py-10" dir='ltr'>
                <h1 className="text-center text-2xl font-bold text-primary my-10">{ lang === 'en' ? "Calculate Solar System Size" :
                    "حساب حجم النظام الشمسي"
                }</h1>

                <div className="grid grid-cols-6 font-semibold text-xs md:text-sm py-4 text-center bg-gray-300 dark:bg-bgm rounded-t-2xl text-secondary dark:text-secondary-10">
                    <div>{ lang === 'en' ? 'Device' : 'الجهاز' }</div>
                    <div>{ lang === 'en' ? 'Power (Watt)' : 'الاستطاعة (الواط)' }</div>
                    <div>{ lang === 'en' ? 'Quantity' : 'العدد' }</div>
                    <div>{ lang === 'en' ? 'Operating Hours (Morning)' : 'ساعات التشغيل في الصباح' }</div>
                    <div>{ lang === 'en' ? 'Operating Hours (Evening)' : 'ساعات التشغيل في المساء' }</div>
                    <div>{ lang === 'en' ? 'Clear' : 'مسح' }</div>
                </div>

                { fields.map((field, index) => {
                    const isCustom = devices[index]?.isCustom;

                    return (
                        <div key={ field.id } className={ `grid grid-cols-6 gap-2 items-center bg-white dark:bg-card p-2 border-b-[1px] border-gray-200 dark:border-gray-700 ${'row-' + index} opacityfull` }>
                            { isCustom ? (
                                <input
                                    { ...register(`devices.${index}.name`) }
                                    disabled={ submited }
                                    className="p-2 rounded col-span-1 text-center focus:border focus:outline-none focus:ring-primary focus:border-primary"
                                    placeholder={ lang === 'en' ? "Device name" : "اسم الجهاز" }
                                    onFocus={ (e) => e.target.select() }

                                />
                            ) : (
                                <select
                                    disabled={ submited }
                                    { ...register(`devices.${index}.name`) }
                                    className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center bg-white dark:bg-card focus:border focus:outline-none focus:ring-primary focus:border-primary"
                                >
                                    <option value="" className='text-gray-300'>{ lang === 'en' ? 'Select device' : 'اختر جهاز' }</option>
                                    { deviceOptions.map((d, i) => (
                                        <option key={ i } value={ d.name }>{ d.name }</option>
                                    )) }
                                </select>
                            ) }

                            <input
                                { ...register(`devices.${index}.wattage`) }
                                type="number"
                                disabled={ submited }
                                className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center focus:border focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder={ lang === 'en' ? "Power (Watt)" : "الاتسطاعة (واط)" }
                                onFocus={ (e) => e.target.select() }

                            />

                            <input
                                { ...register(`devices.${index}.count`) }
                                type="number"
                                disabled={ submited }
                                className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center focus:border focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder={ lang === 'en' ? "Quantity" : "العدد" }
                                onFocus={ (e) => e.target.select() }
                            />

                            <input
                                { ...register(`devices.${index}.morning`) }
                                type="number"
                                disabled={ submited }
                                className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center border border-[transparent] focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder={ lang === 'en' ? "Morning" : "ساعات الصباح" }
                                onFocus={ (e) => e.target.select() }
                            />

                            <input
                                { ...register(`devices.${index}.evening`) }
                                type="number"
                                disabled={ submited }
                                className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center focus:border focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder={ lang === 'en' ? "ُEvening" : "ساعات المساء" }
                                onFocus={ (e) => e.target.select() }
                            />

                            <button disabled={ submited } type="button" onClick={ () => handleRemove(index) } className="text-red-600 col-span-1">🗑️</button>

                            { errors.devices?.[index] && (
                                <div className="col-span-7 text-red-500 text-sm mt-1 text-center">
                                    { Object.values(errors.devices[index]!).map((e, i) => (
                                        <div key={ i }>{ e.message }</div>
                                    )) }
                                </div>
                            ) }
                        </div>
                    );
                }) }

                <div className="flex gap-2 md:gap-4 mt-8 justify-around" dir='ltr' id='output1' >
                    <button
                        type="button"
                        disabled={ submited }
                        // onClick={ () => append({ name: '', wattage: deviceOptions[0].wattage, count: 1, morning: 2, evening: 2, isCustom: false }) }
                        onClick={ () => append({ name: '', wattage: 0, count: 1, morning: 6, evening: 6, isCustom: false }) }
                        className="bg-green-800 text-white px-2  py-3 md:px-4  rounded flex justify-between items-center shadow-xl"
                    >
                        {/* <FaListCheck  /> */ }
                        {/* <FaListUl /> */ }
                        <FaListUl className='' />
                        <FaPlus className='text-[10px] mr-1' />
                        { lang === 'en' ? " Add Device from List " : " أضف من القائمة" }
                    </button>

                    <button
                        type="button"
                        disabled={ submited }
                        onClick={ () => append({ name: '', wattage: 0, count: 1, morning: 6, evening: 6, isCustom: true }) }
                        className="bg-secondary text-white px-2 md:px-4 py-3 rounded flex justify-between items-center shadow-xl"
                    >
                        <FaPlus className='mx-2' />
                        { lang === 'en' ? "Add Custom Device" : " أضف جهاز مخصص" }
                    </button>
                </div>
                <button disabled={ submited } type="submit" className="bg-primary text-white px-4 py-3 rounded flex justify-between items-center my-10 mx-auto shadow-xl">
                    <FaCalculator className='mx-2' />
                    { lang === 'en' ? "Calculate System" : "احسب النظام" }
                </button>


                <button
                    type="button"
                    hidden={ !submited }
                    disabled={ !submited }
                    onClick={ hadnelEditDevices }
                    className="bg-secondary text-white px-2 md:px-4 py-3 rounded flex justify-between items-center shadow-xl"
                >
                    <FaLockOpen className='mx-2' />
                    { lang === 'en' ? "eidit on devices" : "تعديل على الأجهزة" }
                </button>
            </form>
            <hr className='my-6 border-gray-200 sm:mx-auto dark:border-gray-600 lg:my-8' />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-30 text-center" dir='ltr' hidden={ !submited }>
                <div>
                    {/* <ul dir={ lang === 'en' ? 'ltr' : 'rtl' }>
                        <li>
                            ينصح اختيار الألواح التي تكون أكبر من 600(واط)
                        </li>
                    </ul> */}
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        { lang === 'en' ? 'Panel Wattage (W)' : 'قدرة اللوح (واط)' }
                    </label>
                    <input
                        type="number"
                        onFocus={ (e) => e.target.select() }
                        value={ voltagePanel } onChange={ (e) => handelVotagePanel(e) }
                        className="w-full text-center my-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder={ lang === 'en' ? 'Panel Wattage (W)' : 'قدرة اللوح (واط)' }
                    />
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transition-transform hover:shadow-2xl border-b-3 border-secondary dark:border-secondary-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4">
                                <GiSolarPower className="w-10 h-10  text-secondary dark:text-secondary-10" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-primary">
                                { lang === 'en' ? 'Number of panels' : 'عدد الألواح' }
                            </h3>
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                { conditionalRound(outputValue.nPanel) }
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                { outputValue.nPanel }
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        { lang === 'en' ? 'Battery Voltage (V)' : 'قدرة اللوح (واط)' }
                    </label>
                    {/* <input
                        type="number"
                        className="w-full text-center my-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder={ lang === 'en' ? 'Panel Wattage (W)' : 'قدرة اللوح (واط)' }
                    /> */}
                    <select className='w-full text-center my-4 px-3 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white'
                        name="" id="" value={ voltageBattery } onChange={ (e) => handelVotageBatttery(e) }>
                        <option value="12.5">12 V</option>
                        <option value="24">24 V</option>
                        <option value="48">48 V</option>
                    </select>
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transition-transform hover:shadow-2xl border-b-3 border-secondary dark:border-secondary-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4">
                                <FaCarBattery className="w-10 h-10 text-secondary dark:text-secondary-10" />
                            </div>
                            <h3 className="text-xl font-semibold text-primary dark:text-primary-10 mb-2">
                                { lang === 'en' ? 'Number of battery' : 'عدد البطاريات' }
                            </h3>
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                { conditionalRound(outputValue.nBattery) }
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                { outputValue.nBattery }
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        { lang === 'en' ? 'Average Sun Hours (h)' : 'قدرة اللوح (واط)' }
                    </label>
                    <input
                        type="number"
                        className="w-full text-center my-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder={ lang === 'en' ? 'Average sun hours (h)' : 'قدرة اللوح (واط)' }
                    />
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transition-transform hover:shadow-2xl border-b-3 border-secondary dark:border-secondary-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4">
                                <BsDeviceSsd className="w-10 h-10 text-secondary dark:text-secondary-10" />
                            </div>
                            <h3 className="text-xl font-semibold text-primary dark:text-primary-10 mb-2">
                                { lang === 'en' ? 'Inverter size required' : 'سعة الانفرتر' }
                            </h3>
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                { Math.round(outputValue.cInverter) } W
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                { outputValue.cInverter } W
                            </span>
                            {/* <p className="text-gray-600 dark:text-white font-bold">
                                { outputValue.cInverter }W
                            </p> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
