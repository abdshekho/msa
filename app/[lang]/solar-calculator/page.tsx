//@ts-nocheck
'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { use, useEffect, useState } from 'react';
import { FaCalculator, FaCarBattery, FaPlus, FaSolarPanel } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { BsDeviceSsd } from 'react-icons/bs';
import { GiSolarPower } from 'react-icons/gi';

const deviceOptions = [
    { name: 'نيون', wattage: 40 },
    { name: 'براد', wattage: 150 },
    { name: 'مروحة', wattage: 75 },
];

const schema = z.object({
    devices: z.array(z.object({
        name: z.string().min(1, 'اسم الجهاز مطلوب'),
        wattage: z.coerce.number().min(1, 'الواط يجب أن يكون 1 أو أكثر').max(10000, 'تأكد من الاستطاعة'),
        count: z.coerce.number().min(1, 'العدد يجب أن يكون 1 أو أكثر').max(99, 'تأكد من عدد الأجهزة'),
        morning: z.coerce.number().min(0, 'ساعات التشغيل يجب ان تكون 0 أو اكثر').max(15, 'تأكد من ساعات التشغيل في الصباح'),
        evening: z.coerce.number().min(0, 'ساعات التشغيل يجب ان تكون 0 أو اكثر').max(15, 'تأكد من ساعات التشغيل في المساء'),
        isCustom: z.boolean().optional()
    })),
});

type FormData = z.infer<typeof schema>;

export default function SolarCalculator() {
    const lang = usePathname().slice(1, 3) || 'en';
    const { control, register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            devices: [
                { name: '', wattage: 0, count: 1, morning: 6, evening: 6, isCustom: false }
            ]
        },
        resolver: zodResolver(schema),
    });
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
    const [voltageBattery, setVoltageBattery] = useState(12.5);
    const [voltagePanel, setVoltagePanel] = useState(705);
    const [capacityInverter, setCapacityInverter] = useState(0);


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
            <form onSubmit={ handleSubmit(onSubmit) } className="" dir='ltr'>
                <h1 className="text-center text-2xl font-bold text-primary my-10">احسب الطاقة والاجهزة اللازمة</h1>

                <div className="grid grid-cols-6 font-semibold text-xs md:text-sm py-4 text-center bg-gray-300 dark:bg-bgm rounded-t-2xl text-secondary dark:text-secondary-10">
                    <div>الجهاز</div>
                    <div>الاستطاعة (الواط)</div>
                    <div>العدد</div>
                    <div>ساعات التشغيل في الصباح</div>
                    <div>ساعات التشغل في المساء</div>
                    <div>مسح</div>
                </div>

                { fields.map((field, index) => {
                    const isCustom = devices[index]?.isCustom;

                    return (
                        <div key={ field.id } className={ `grid grid-cols-6 gap-2 items-center bg-white dark:bg-card p-2 border-b-[1px] border-gray-200 dark:border-gray-700 ${'row-' + index} opacityfull` }>
                            { isCustom ? (
                                <input
                                    { ...register(`devices.${index}.name`) }
                                    className="p-2 rounded col-span-1 text-center focus:border focus:outline-none focus:ring-primary focus:border-primary"
                                    placeholder="اسم الجهاز"
                                    onFocus={ (e) => e.target.select() }

                                />
                            ) : (
                                <select
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
                                className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center focus:border focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="واط"
                                onFocus={ (e) => e.target.select() }

                            />

                            <input
                                { ...register(`devices.${index}.count`) }
                                type="number"
                                className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center focus:border focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="العدد"
                                onFocus={ (e) => e.target.select() }
                            />

                            <input
                                { ...register(`devices.${index}.morning`) }
                                type="number"
                                className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center border border-[transparent] focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="الصباح"
                                onFocus={ (e) => e.target.select() }
                            />

                            <input
                                { ...register(`devices.${index}.evening`) }
                                type="number"
                                className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center focus:border focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="المساء"
                                onFocus={ (e) => e.target.select() }
                            />

                            <button type="button" onClick={ () => handleRemove(index) } className="text-red-600 col-span-1">🗑️</button>

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

                <div className="flex gap-4 mt-8 justify-around" dir='ltr'>
                    <button
                        type="button"
                        // onClick={ () => append({ name: '', wattage: deviceOptions[0].wattage, count: 1, morning: 2, evening: 2, isCustom: false }) }
                        onClick={ () => append({ name: '', wattage: 0, count: 1, morning: 6, evening: 6, isCustom: false }) }
                        className="bg-green-800 text-white px-4 py-3 rounded flex justify-between items-center"
                    >
                        <FaPlus className='mx-2' />
                        أضف من القائمة
                    </button>

                    <button
                        type="button"
                        onClick={ () => append({ name: '', wattage: 0, count: 1, morning: 6, evening: 6, isCustom: true }) }
                        className="bg-secondary text-white px-4 py-3 rounded flex justify-between items-center"
                    >
                        <FaPlus className='mx-2' />
                        أضف مخصص
                    </button>
                </div>
                <button type="submit" className="bg-primary text-white px-4 py-3 rounded flex justify-between items-center my-10 mx-auto">
                    <FaCalculator className='mx-2' />
                    احسب الاستطاعة
                </button>

            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10 text-center" dir='ltr'>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        { lang === 'en' ? 'Panel Wattage (W)' : 'قدرة اللوح (واط)' }
                    </label>
                    <input
                        type="number"
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
                                { Math.round(outputValue.nPanel) }
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
                                { Math.round(outputValue.nBattery) }
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
                                { Math.round(outputValue.cInverter) }
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                { outputValue.cInverter }
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
