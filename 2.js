var awaitForCondition = function(callback) {
    var module_loaded = 0;
    var int = setInterval(function() {
        Process.enumerateModulesSync()
        .filter(function(m){ return m['path'].toLowerCase().indexOf('libdefault.so') != -1; })
        .forEach(function(m) {
            console.log("libdefault.so loaded!");
            return module_loaded = 1;
        })
        if(module_loaded) {
            clearInterval(int);
            callback();
            return;
        }
    }, 0);
}

function nativeTrace(nativefunc) {
    var nativefunc_addr=Module.getExportByName("libdefault.so", nativefunc) 
    var func=ptr(nativefunc_addr);
    
    Interceptor.attach(func, {
        // set hook 
        onEnter: function (args) { 
            console.warn("\n[+] " + nativefunc + " called"); // before call 
            if (nativefunc == "_Z17_Z1aP7_JNIEnvP8_1PKcS0_") { 
                console.log("\n\x1b[31margs[0]:\x1b[0m \x1b[34m" + args[0].readUtf8String() + ", \x1b[32mType: "); 
                console.log("\n\x1b[31margs[1]:\x1b[0m \x1b[34m" + args[1].readUtf8String() + ", \x1b[32mType: "); 
            } 
        }, 
        onLeave: function (retval) { 
            if(nativefunc == "_Z17_Z1aP7_JNIEnvP8_1PKcS0_"){ 
                console.warn("[-] " + nativefunc + " ret: " + retval.toString() ); // after call 
            } 
        } 
    }); 
}

function hook() {
    nativeTrace("_Z17_Z1aP7_JNIEnvP8_1PKcS0_");
}

awaitForCondition(hook);
