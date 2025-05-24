import { useRef } from "react";

const DEVICES = [
  { name: "نيون", wattage: 40 },
  { name: "براد", wattage: 150 },
  { name: "مروحة", wattage: 75 },
];

export default function Home() {
  const formRef = useRef(null);

  const addDeviceRow = (custom = false) => {
    const container = document.getElementById("device-list");

    const row = document.createElement("div");
    row.className = "device-row grid grid-cols-7 gap-2 mb-2 items-center bg-white p-2 border rounded";

    // زر الحذف
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "text-red-600 hover:text-red-800 font-bold";
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => row.remove();

    if (custom) {
      const nameInput = document.createElement("input");
      nameInput.name = "device[]";
      nameInput.type = "text";
      nameInput.placeholder = "اسم الجهاز";
      nameInput.className = "col-span-1 p-2 border rounded";

      const wattageInput = document.createElement("input");
      wattageInput.name = "wattage[]";
      wattageInput.type = "number";
      wattageInput.placeholder = "الواط";
      wattageInput.className = "col-span-1 p-2 border rounded";

      row.appendChild(nameInput);
      row.appendChild(wattageInput);
    } else {
      const select = document.createElement("select");
      select.name = "device[]";
      select.className = "col-span-1 p-2 border rounded";

      DEVICES.forEach(device => {
        const option = document.createElement("option");
        option.value = device.name;
        option.text = device.name;
        select.appendChild(option);
      });

      const wattageInput = document.createElement("input");
      wattageInput.name = "wattage[]";
      wattageInput.type = "number";
      wattageInput.placeholder = "الواط";
      wattageInput.value = DEVICES[0].wattage;
      wattageInput.className = "col-span-1 p-2 border rounded";

      select.addEventListener("change", (e) => {
        const selected = DEVICES.find(d => d.name === e.target.value);
        wattageInput.value = selected?.wattage || 0;
      });

      row.appendChild(select);
      row.appendChild(wattageInput);
    }

    const countInput = document.createElement("input");
    countInput.name = "count[]";
    countInput.type = "number";
    countInput.placeholder = "العدد";
    countInput.value = 1;
    countInput.className = "col-span-1 p-2 border rounded";

    const morningInput = document.createElement("input");
    morningInput.name = "morning[]";
    morningInput.type = "number";
    morningInput.placeholder = "ساعات الصباح";
    morningInput.value = 2;
    morningInput.className = "col-span-1 p-2 border rounded";

    const eveningInput = document.createElement("input");
    eveningInput.name = "evening[]";
    eveningInput.type = "number";
    eveningInput.placeholder = "ساعات المساء";
    eveningInput.value = 2;
    eveningInput.className = "col-span-1 p-2 border rounded";

    row.appendChild(countInput);
    row.appendChild(morningInput);
    row.appendChild(eveningInput);
    row.appendChild(deleteBtn);

    container.appendChild(row);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    const devices = formData.getAll("device[]");
    const wattages = formData.getAll("wattage[]");
    const counts = formData.getAll("count[]");
    const mornings = formData.getAll("morning[]");
    const evenings = formData.getAll("evening[]");

    let total = 0;
    for (let i = 0; i < devices.length; i++) {
      const count = Number(counts[i]);
      const hours = Number(mornings[i]) + Number(evenings[i]);
      const watt = Number(wattages[i]);
      total += count * watt * hours;
    }

    alert(`⚡ الاستطاعة اليومية المقدرة: ${total} واط/ساعة`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">🔋 حاسبة الطاقة للأنظمة الشمسية</h1>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* رؤوس الأعمدة */}
        <div className="grid grid-cols-7 gap-2 font-semibold text-gray-700 mb-2">
          <div>الجهاز</div>
          <div>الاستطاعة (واط)</div>
          <div>العدد</div>
          <div>ساعات الصباح</div>
          <div>ساعات المساء</div>
          <div>مسح</div>
        </div>

        <div id="device-list" className="space-y-2"></div>

        <div className="flex gap-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => addDeviceRow(false)}
          >
            ➕ أضف جهاز من القائمة
          </button>

          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => addDeviceRow(true)}
          >
            ➕ أضف جهاز مخصص
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 mt-4"
        >
          💡 احسب الاستطاعة اليومية
        </button>
      </form>
    </div>
  );
}
