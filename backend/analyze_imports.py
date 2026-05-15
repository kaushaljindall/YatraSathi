import os
import ast
import sys

stdlib = sys.stdlib_module_names if hasattr(sys, 'stdlib_module_names') else set()
# Some common builtins that might not be in stdlib_module_names
builtins = {'os', 'sys', 'ast', 'json', 're', 'logging', 'time', 'datetime', 'collections', 'typing', 'asyncio', 'math'}

imports = set()
for root, _, files in os.walk('.'):
    for file in files:
        if file.endswith('.py'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                try:
                    tree = ast.parse(f.read())
                    for node in ast.walk(tree):
                        if isinstance(node, ast.Import):
                            for name in node.names:
                                base_module = name.name.split('.')[0]
                                imports.add(base_module)
                        elif isinstance(node, ast.ImportFrom):
                            if node.module:
                                base_module = node.module.split('.')[0]
                                # Ignore relative imports (level > 0) for external dependencies analysis
                                if node.level == 0:
                                    imports.add(base_module)
                except Exception as e:
                    pass

external_imports = sorted(list(imports - stdlib - builtins))
print("External or Project Modules found:")
for imp in external_imports:
    print(imp)
