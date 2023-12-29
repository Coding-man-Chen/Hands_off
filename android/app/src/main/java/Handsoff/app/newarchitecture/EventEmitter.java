package Handsoff.app.newarchitecture;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class EventEmitter {
    //RS Bridge
    public static ReactContext mReactContext;
    public static void sendEvent(String eventName, Boolean params) {
        if(mReactContext==null){
            Log.d("Bridge","dont find RN methods");
            return;
        }
        Log.d("Bridge","trigger run");
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,params);
    }

}
