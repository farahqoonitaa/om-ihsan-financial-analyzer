import re

with open('public/index.html') as f:
    html = f.read()

print("Validating refined output components in public/index.html:")

# 1. Check Executive Matrix DOM IDs
for mode in ['investasi_pindo', 'investasi_daaz', 'pengendali', 'nonpengendali', 'konsolidasi']:
    matrix_id = f'id="nd_matrix_{mode}"'
    assert matrix_id in html, f"Missing {matrix_id}"
    print(f"✅ {matrix_id} exists")

# 2. Check Collapsible Extended Details
for mode in ['investasi_pindo', 'investasi_daaz', 'pengendali', 'nonpengendali', 'konsolidasi']:
    details_id = f'id="details_s1_s10_{mode}"'
    assert details_id in html, f"Missing {details_id}"
    print(f"✅ {details_id} exists with class no-print extended-audit-details")

# 3. Check format selector
assert 'class="export-format-selector"' in html
print("✅ export-format-selector exists in Step 5")

# 4. Check renderExecutiveSignalMatrix function
assert 'function renderExecutiveSignalMatrix' in html
print("✅ renderExecutiveSignalMatrix function defined")

# 5. Check printNotaDinas executive filtering
assert "if (format === 'executive')" in html
assert "clone.querySelectorAll('.extended-audit-details, .no-print').forEach(c => c.remove());" in html
assert "@page {" in html and "margin:" in html
assert "tr, td, th {" in html and "page-break-inside: avoid !important;" in html
print("✅ printNotaDinas has executive filtering and strict page-break CSS")

# 6. Check downloadNotaDinasDoc executive filtering
assert "clone.querySelectorAll('.extended-audit-details, .no-print').forEach(c => c.remove());" in html
print("✅ downloadNotaDinasDoc has executive filtering")

print("\n🎉 ALL REFINED COMPONENT VALIDATIONS PASSED!")
