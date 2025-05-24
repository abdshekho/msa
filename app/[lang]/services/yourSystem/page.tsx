//@ts-nocheck
'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const deviceOptions = [
    { name: 'نيون', wattage: 40 },
    { name: 'براد', wattage: 150 },
    { name: 'مروحة', wattage: 75 },
];

const schema = z.object({
    devices: z.array(z.object({
        name: z.string().min(1, 'اسم الجهاز مطلوب'),
        wattage: z.coerce.number().min(1, 'الواط يجب أن يكون 1 أو أكثر'),
        count: z.coerce.number().min(1, 'العدد يجب أن يكون 1 أو أكثر'),
        morning: z.coerce.number().min(0, 'ساعات التشغيل يجب ان تكون 0 أو اكثر'),
        evening: z.coerce.number().min(0, 'ساعات التشغيل يجب ان تكون 0 أو اكثر'),
        isCustom: z.boolean().optional()
    })),
});

type FormData = z.infer<typeof schema>;

export default function SolarCalculator() {
    const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            devices: [
                { name: '', wattage: 0, count: 1, morning: 2, evening: 2, isCustom: false }
            ]
        },
        resolver: zodResolver(schema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'devices'
    });

    const devices = watch('devices');

    const onSubmit = (data: FormData) => {
        // const total = data.devices.reduce((acc, d) => {
        //     return acc + (d.count * d.wattage * (d.morning + d.evening));
        // }, 0);
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
        const NumberOfBattery = capacityOfBattery / 12.5 / 1000 / 0.7

        // 705 is watt of panel
        const NumberOfPanel = (capacityOfBattery + totalMorning) / 4.8 / 705 / 0.8

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
                    }
                }
            }
        });
    }, [devices.map(d => d.name).join(','), fields.map(f => f.name).join(','), setValue]);

    return (
        <form onSubmit={ handleSubmit(onSubmit) } className="p-6 max-w-5xl mx-auto space-y-4 text-black dark:text-white">
            <h1 className="text-center text-2xl font-bold text-primary">🔋 حاسبة الطاقة</h1>

            <div className="grid grid-cols-6 font-semibold text-center text-secondary dark:text-secondary-10">
                <div>الجهاز</div>
                <div>الواط</div>
                <div>العدد</div>
                <div>ساعات التشغيل في الصباح</div>
                <div>ساعات التشغل في المساء</div>
                <div>مسح</div>
            </div>

            { fields.map((field, index) => {
                const isCustom = devices[index]?.isCustom;

                return (
                    <div key={ field.id } className="grid grid-cols-6 gap-2 items-center bg-card-10 dark:bg-card p-2 rounded">
                        { isCustom ? (
                            <input
                                { ...register(`devices.${index}.name`) }
                                className="p-2 rounded col-span-1 text-center"
                                placeholder="اسم الجهاز"
                                onFocus={ (e) => e.target.select() }

                            />
                        ) : (
                            <select
                                { ...register(`devices.${index}.name`) }
                                className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center bg-card-10 dark:bg-card "
                            >
                                { deviceOptions.map((d, i) => (
                                    <option key={ i } value={ d.name }>{ d.name }</option>
                                )) }
                            </select>
                        ) }

                        <input
                            { ...register(`devices.${index}.wattage`) }
                            type="number"
                            className="px-0 md:px-2 py-2  md:py-2 rounded col-span-1 text-center"
                            placeholder="واط"
                            onFocus={ (e) => e.target.select() }
                        />

                        <input
                            { ...register(`devices.${index}.count`) }
                            type="number"
                            className="px-0 md:px-2 py-2  rounded col-span-1 text-center"
                            placeholder="العدد"
                            onFocus={ (e) => e.target.select() }
                        />

                        <input
                            { ...register(`devices.${index}.morning`) }
                            type="number"
                            className="px-0 md:px-2 py-2  rounded col-span-1 text-center"
                            placeholder="الصباح"
                            onFocus={ (e) => e.target.select() }
                        />

                        <input
                            { ...register(`devices.${index}.evening`) }
                            type="number"
                            className="px-0 md:px-2 py-2  rounded col-span-1 text-center"
                            placeholder="المساء"
                            onFocus={ (e) => e.target.select() }
                        />

                        <button type="button" onClick={ () => remove(index) } className="text-red-600 col-span-1">🗑️</button>

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

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={ () => append({ name: '', wattage: deviceOptions[0].wattage, count: 1, morning: 2, evening: 2, isCustom: false }) }
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    ➕ أضف من القائمة
                </button>

                <button
                    type="button"
                    onClick={ () => append({ name: '', wattage: 0, count: 1, morning: 2, evening: 2, isCustom: true }) }
                    className="bg-secondary text-white px-4 py-2 rounded"
                >
                    ➕ أضف مخصص
                </button>
            </div>

            <button type="submit" className="bg-primary text-white px-6 py-2 rounded mt-4">
                💡 احسب الاستطاعة
            </button>
        </form>
    );
}
