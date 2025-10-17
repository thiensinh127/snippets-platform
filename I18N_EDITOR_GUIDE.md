# 🌍 I18n Guide cho SnippetFileEditor

## ✅ Đã Hoàn Thành

Component **SnippetFileEditor** đã được cập nhật để hỗ trợ đa ngôn ngữ (i18n) với **next-intl**.

---

## 📦 Các Thay Đổi

### 1. **Thêm Translation Keys**

#### `messages/en.json`

```json
{
  "editor": {
    "title": "Code Editor",
    "formatting": "Formatting...",
    "formatCode": "Format code",
    "formatCodeShortcut": "Format code (Shift+Alt+F)",
    "alignLeft": "Align left",
    "fullscreen": "Fullscreen",
    "exitFullscreen": "Exit fullscreen",
    "syntaxError": "Syntax error in code. Please fix the syntax before formatting.",
    "formatError": "Unable to format code. Try selecting a different language.",
    "dismiss": "Dismiss",
    "loading": "Loading editor...",
    "fullscreenPlaceholder": "Editor is in fullscreen mode"
  }
}
```

#### `messages/vi.json`

```json
{
  "editor": {
    "title": "Trình soạn thảo Code",
    "formatting": "Đang format...",
    "formatCode": "Format code",
    "formatCodeShortcut": "Format code (Shift+Alt+F)",
    "alignLeft": "Căn trái",
    "fullscreen": "Toàn màn hình",
    "exitFullscreen": "Thoát toàn màn hình",
    "syntaxError": "Lỗi cú pháp trong code. Vui lòng sửa cú pháp trước khi format.",
    "formatError": "Không thể format code. Hãy thử chọn ngôn ngữ khác.",
    "dismiss": "Đóng",
    "loading": "Đang tải editor...",
    "fullscreenPlaceholder": "Editor đang ở chế độ toàn màn hình"
  }
}
```

### 2. **Cập Nhật Component**

```tsx
import { useTranslations } from "next-intl";

export default function SnippetFileEditor({...}) {
  const t = useTranslations("editor");

  // Sử dụng translations
  return (
    <div>
      <h3>{t("title")}</h3>
      <button title={t("formatCodeShortcut")}>...</button>
      {/* ... */}
    </div>
  );
}
```

---

## 🗂️ Cấu Trúc Translation Keys

| Key                            | Mô Tả                    | Ví Dụ (EN)                   | Ví Dụ (VI)                         |
| ------------------------------ | ------------------------ | ---------------------------- | ---------------------------------- |
| `editor.title`                 | Tiêu đề editor           | Code Editor                  | Trình soạn thảo Code               |
| `editor.formatting`            | Trạng thái đang format   | Formatting...                | Đang format...                     |
| `editor.formatCode`            | Text nút format          | Format code                  | Format code                        |
| `editor.formatCodeShortcut`    | Tooltip với shortcut     | Format code (Shift+Alt+F)    | Format code (Shift+Alt+F)          |
| `editor.alignLeft`             | Tooltip căn trái         | Align left                   | Căn trái                           |
| `editor.fullscreen`            | Tooltip fullscreen       | Fullscreen                   | Toàn màn hình                      |
| `editor.exitFullscreen`        | Tooltip thoát fullscreen | Exit fullscreen              | Thoát toàn màn hình                |
| `editor.syntaxError`           | Lỗi cú pháp              | Syntax error in code...      | Lỗi cú pháp trong code...          |
| `editor.formatError`           | Lỗi format               | Unable to format code...     | Không thể format code...           |
| `editor.dismiss`               | Đóng thông báo           | Dismiss                      | Đóng                               |
| `editor.loading`               | Đang tải                 | Loading editor...            | Đang tải editor...                 |
| `editor.fullscreenPlaceholder` | Placeholder fullscreen   | Editor is in fullscreen mode | Editor đang ở chế độ toàn màn hình |

---

## 🎯 Các Element Đã Được I18n

### 1. **Toolbar**

- ✅ Tiêu đề "Code Editor"
- ✅ Tooltip của nút Format (với shortcut)
- ✅ Tooltip của nút Align Left
- ✅ Tooltip của nút Fullscreen/Exit Fullscreen

### 2. **Format Status**

- ✅ Text "Formatting..." khi đang format code

### 3. **Error Messages**

- ✅ Syntax error message
- ✅ General format error message
- ✅ Dismiss button aria-label

### 4. **Loading States**

- ✅ Loading editor text
- ✅ Fullscreen placeholder text

---

## 🚀 Cách Sử Dụng

### Thay Đổi Ngôn Ngữ

Component tự động lấy ngôn ngữ từ context của **next-intl**. Người dùng có thể đổi ngôn ngữ qua **LanguageSwitcher** component.

```tsx
// LanguageSwitcher tự động cập nhật cookie và reload
<LanguageSwitcher />
```

### Test I18n

1. **Kiểm tra tiếng Anh:**
   - Đảm bảo cookie `NEXT_LOCALE=en`
   - Mở `/snippets/new`
   - Các text hiển thị bằng tiếng Anh

2. **Kiểm tra tiếng Việt:**
   - Đặt cookie `NEXT_LOCALE=vi`
   - Mở `/snippets/new`
   - Các text hiển thị bằng tiếng Việt

3. **Kiểm tra error messages:**
   - Viết code sai cú pháp
   - Nhấn format (Shift+Alt+F)
   - Error message hiển thị đúng ngôn ngữ

---

## 🔧 Thêm Ngôn Ngữ Mới

### Bước 1: Tạo File Translation

Tạo file mới trong `messages/`:

```bash
# Ví dụ: thêm tiếng Nhật
touch messages/ja.json
```

### Bước 2: Copy Translation Keys

Copy từ `en.json` và dịch:

```json
{
  "editor": {
    "title": "コードエディター",
    "formatting": "フォーマット中...",
    "formatCode": "コードをフォーマット",
    ...
  }
}
```

### Bước 3: Cập Nhật Config

Thêm locale mới vào `i18n.config.ts`:

```ts
export const locales = ["en", "vi", "ja"] as const;
```

### Bước 4: Cập Nhật `lib/i18n.ts`

```ts
export const locales = ["en", "vi", "ja"] as const;
```

---

## 📝 Best Practices

### 1. **Namespace Organization**

Tất cả keys của editor nằm trong namespace `editor`:

```tsx
const t = useTranslations("editor");
t("title"); // ✅ Đúng
t("editor.title"); // ❌ Sai
```

### 2. **Key Naming Convention**

- Dùng camelCase: `formatCodeShortcut`
- Tên key mô tả nội dung: `syntaxError` thay vì `error1`
- Ngắn gọn nhưng rõ nghĩa

### 3. **Avoid Hardcoded Text**

```tsx
// ❌ Sai
<button>Format code</button>

// ✅ Đúng
<button>{t("formatCode")}</button>
```

### 4. **Tooltips và Aria Labels**

Luôn dịch tooltips và aria-labels:

```tsx
<button
  title={t("formatCodeShortcut")}  // ✅
  aria-label={t("dismiss")}         // ✅
>
```

---

## 🐛 Troubleshooting

### 1. **Text không hiển thị đúng ngôn ngữ**

**Nguyên nhân:** Cookie `NEXT_LOCALE` không đúng

**Giải pháp:**

```tsx
// Kiểm tra cookie
document.cookie; // Tìm NEXT_LOCALE

// Hoặc dùng LanguageSwitcher để đổi ngôn ngữ
```

### 2. **Lỗi "Translation key not found"**

**Nguyên nhân:** Key chưa được định nghĩa trong file translation

**Giải pháp:**

- Kiểm tra `messages/en.json` và `messages/vi.json`
- Đảm bảo key tồn tại trong cả 2 file

### 3. **Component không re-render khi đổi ngôn ngữ**

**Nguyên nhân:** Next.js cache

**Giải pháp:**

```tsx
// LanguageSwitcher đã xử lý việc này
router.refresh(); // Reload page sau khi đổi locale
```

---

## ✅ Testing Checklist

- [ ] Tiếng Anh hiển thị đúng
- [ ] Tiếng Việt hiển thị đúng
- [ ] Toolbar tooltips đúng ngôn ngữ
- [ ] Error messages đúng ngôn ngữ
- [ ] Loading states đúng ngôn ngữ
- [ ] Fullscreen placeholder đúng ngôn ngữ
- [ ] Format shortcut (Shift+Alt+F) vẫn hoạt động
- [ ] Đổi ngôn ngữ qua LanguageSwitcher hoạt động

---

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Guide](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [React Intl Best Practices](https://formatjs.io/docs/react-intl)

---

## 🎉 Kết Quả

Component **SnippetFileEditor** giờ đây:

- ✅ Hỗ trợ đa ngôn ngữ (EN/VI)
- ✅ Tự động lấy ngôn ngữ từ context
- ✅ Dễ dàng thêm ngôn ngữ mới
- ✅ Tất cả text đều được dịch
- ✅ Tooltips và aria-labels đúng ngôn ngữ

**Trải nghiệm người dùng tốt hơn cho cộng đồng quốc tế!** 🌍
