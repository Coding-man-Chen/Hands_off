package Handsoff.app.newarchitecture;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

public class CalendarModule extends ReactContextBaseJavaModule {
    CalendarModule(ReactApplicationContext context) {
        super(context);
    }
    @NonNull
    @Override
    public String getName(){
        return "CalenderModule";
    }
    @ReactMethod
    public void createCalenderEvent(ReadableArray args ){
        Log.w("Got Data", args.getString(2));
    }


    @ReactMethod
    public void createCalenderPromise(Promise promise){
        try{
            int i = (int)(1+Math.random()*(10-1+1));
            if(i%2==0){
                promise.resolve(1);
                Log.w("test", "connect");
            }
            else {
                promise.resolve(0);
                Log.w("test", "unconnect");
            }

        }catch (Exception e)
        {
            promise.reject("Error returned from promise",e);
        }
    }
}
