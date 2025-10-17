# 🎨 Thay Đổi Editor sang CodeMirror

## ✅ Những Gì Đã Thay Đổi

### **Editor Mới với CodeMirror**

Thay vì sử dụng Textarea + Preview Mode, bây giờ sử dụng **CodeMirror** - một editor chuyên nghiệp với:

✨ **Tính Năng Nổi Bật:**

- ✅ Syntax highlighting trực tiếp trong editor (không cần preview)
- ✅ Line numbers
- ✅ Code folding
- ✅ Bracket matching
- ✅ Auto-completion
- ✅ Multiple cursors
- ✅ Search & replace
- ✅ Syntax validation
- ✅ Theme: One Dark (giống VS Code)

🗑️ **Đã Bỏ:**

- ❌ Preview mode (không cần thiết vì có syntax highlighting trực tiếp)
- ❌ Theme selector (dùng theme cố định One Dark)

✅ **Giữ Lại:**

- ✅ Format Code (Shift+Alt+F)
- ✅ Align Left (căn trái code)
- ✅ Fullscreen mode
- ✅ Error notifications

---

## 📦 Packages Đã Cài

```bash
npm install @uiw/react-codemirror \
  @codemirror/lang-javascript \
  @codemirror/lang-html \
  @codemirror/lang-css \
  @codemirror/lang-json \
  @codemirror/lang-python \
  @codemirror/lang-php \
  @codemirror/lang-java \
  @codemirror/lang-cpp \
  @codemirror/lang-sql \
  @codemirror/lang-xml \
  @codemirror/lang-markdown \
  @codemirror/lang-yaml \
  @codemirror/lang-rust \
  @codemirror/theme-one-dark
```

---

## 🔄 Files Đã Thay Đổi

### 1. **`components/snippets/SnippetFileEditor.tsx`** (Viết lại hoàn toàn)

**Trước:**

- Textarea với line numbers riêng
- Toggle Edit/Preview mode
- Theme selector với 16 themes
- react-syntax-highlighter cho preview

**Sau:**

- CodeMirror editor với syntax highlighting tích hợp
- Chỉ có Edit mode
- Theme cố định One Dark
- Hỗ trợ nhiều ngôn ngữ:
  - JavaScript, TypeScript, JSX, TSX
  - HTML, CSS, JSON
  - Python, PHP, Java
  - C++, SQL, XML
  - Markdown, YAML, Rust

### 2. **`app/globals.css`**

Thêm custom styles cho CodeMirror:

```css
.codemirror-wrapper {
  font-family: "JetBrains Mono", "Fira Code", "Consolas", "Monaco", monospace;
  font-size: 14px;
  line-height: 1.5;
}
```

---

## 🎯 Tính Năng Được Giữ Lại

### 1. **Format Code** (Wand Icon)

- Click nút hoặc nhấn `Shift+Alt+F`
- Hỗ trợ: JavaScript, TypeScript, JSX, TSX, HTML, CSS, JSON, Markdown
- Hiển thị lỗi nếu code có syntax error
- Fallback cho JSON parsing

### 2. **Align Left** (AlignLeft Icon)

- Loại bỏ indentation thừa
- Căn tất cả code về trái
- Giữ nguyên cấu trúc tương đối

### 3. **Fullscreen** (Maximize Icon)

- Mở editor toàn màn hình
- Sử dụng Portal để render
- Thoát bằng Minimize Icon
- Hiển thị placeholder khi fullscreen

---

## 🎨 Giao Diện

### Toolbar

```
┌─────────────────────────────────────────────────────────┐
│ Code Editor        [Format] [AlignLeft] [Fullscreen]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1  function hello() {                                  │
│  2    console.log('Hello World');                       │
│  3  }                                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Error Banner (khi format lỗi)

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Lỗi cú pháp trong code. Vui lòng sửa...       [×]    │
├─────────────────────────────────────────────────────────┤
```

---

## 🚀 Cách Sử Dụng

### Trong Component

Component không thay đổi cách sử dụng:

```tsx
<SnippetFileEditor
  value={watch("code")}
  onChange={(v) => setValue("code", v, { shouldValidate: true })}
  invalid={!!errors.code}
  language={watch("language")}
/>
```

### Keyboard Shortcuts

| Shortcut      | Chức năng                    |
| ------------- | ---------------------------- |
| `Shift+Alt+F` | Format code                  |
| `Ctrl+F`      | Search (CodeMirror built-in) |
| `Ctrl+Z`      | Undo                         |
| `Ctrl+Y`      | Redo                         |
| `Ctrl+/`      | Toggle comment               |
| `Tab`         | Indent                       |
| `Shift+Tab`   | Outdent                      |

---

## ✨ Ưu Điểm Của CodeMirror

### So với Textarea + Preview

| Feature             | Textarea + Preview | CodeMirror      |
| ------------------- | ------------------ | --------------- |
| Syntax Highlighting | Chỉ trong preview  | ✅ Trong editor |
| Code Completion     | ❌                 | ✅              |
| Error Detection     | ❌                 | ✅              |
| Bracket Matching    | ❌                 | ✅              |
| Code Folding        | ❌                 | ✅              |
| Multiple Cursors    | ❌                 | ✅              |
| Search & Replace    | Basic              | ✅ Advanced     |
| Performance         | Tốt                | ✅ Excellent    |
| Mobile Friendly     | Tốt                | ✅ Excellent    |

---

## 🧪 Testing

Test các tính năng sau:

### Format Code

- [ ] JavaScript/TypeScript
- [ ] JSX/TSX
- [ ] HTML
- [ ] CSS
- [ ] JSON
- [ ] Markdown

### Language Support

- [ ] Syntax highlighting cho từng ngôn ngữ
- [ ] Auto-completion
- [ ] Bracket matching

### UI Features

- [ ] Fullscreen mode
- [ ] Align left
- [ ] Error messages
- [ ] Toolbar buttons

---

## 🎨 Customization

### Thay Đổi Theme

Hiện tại dùng `oneDark`. Để thay đổi, edit `SnippetFileEditor.tsx`:

```tsx
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
// hoặc
import { githubLight } from '@uiw/codemirror-theme-github';

// Trong component:
<CodeMirror
  theme={vscodeDark} // thay vì oneDark
  ...
/>
```

### Thêm Language

Cài package và thêm vào `getLanguageExtension()`:

```bash
npm install @codemirror/lang-<language>
```

```tsx
import { <language> } from "@codemirror/lang-<language>";

case "<language>":
  return <language>();
```

### Thay Đổi Font

Edit trong `globals.css`:

```css
.codemirror-wrapper {
  font-family: "Your Font", monospace;
  font-size: 16px; /* thay đổi kích thước */
}
```

---

## 📚 Resources

- [CodeMirror Documentation](https://codemirror.net/docs/)
- [React CodeMirror](https://uiwjs.github.io/react-codemirror/)
- [Available Languages](https://codemirror.net/docs/ref/#languages)
- [Available Themes](https://uiwjs.github.io/react-codemirror/#themes)

---

## 🌍 Internationalization (i18n)

Component đã được tích hợp đa ngôn ngữ với **next-intl**:

- ✅ Hỗ trợ tiếng Anh (EN) và tiếng Việt (VI)
- ✅ Tất cả text trong UI đều được dịch
- ✅ Tooltips và error messages đa ngôn ngữ
- ✅ Tự động lấy ngôn ngữ từ cookie `NEXT_LOCALE`
- ✅ Dễ dàng thêm ngôn ngữ mới

### Translation Keys

Tất cả translations nằm trong namespace `editor`:

```typescript
const t = useTranslations("editor");
t("title"); // "Code Editor" hoặc "Trình soạn thảo Code"
t("formatting"); // "Formatting..." hoặc "Đang format..."
t("formatCode"); // "Format code"
t("alignLeft"); // "Align left" hoặc "Căn trái"
t("fullscreen"); // "Fullscreen" hoặc "Toàn màn hình"
```

Xem chi tiết trong `I18N_EDITOR_GUIDE.md`

---

## 🎉 Kết Quả

Bây giờ bạn có một code editor chuyên nghiệp với:

- ✅ Syntax highlighting trong editor
- ✅ Code completion và validation
- ✅ Format code (Shift+Alt+F)
- ✅ Align left
- ✅ Fullscreen mode
- ✅ Trải nghiệm giống VS Code
- ✅ **Hỗ trợ đa ngôn ngữ (EN/VI)**

**Không còn cần Preview mode vì syntax highlighting đã có sẵn trong editor!** 🚀
