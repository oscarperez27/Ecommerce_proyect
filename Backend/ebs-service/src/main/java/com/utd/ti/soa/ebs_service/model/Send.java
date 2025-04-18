package com.utd.ti.soa.ebs_service.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Send {
    private String weight;
    private String packageDimensions;
    private String destination;
    private String origin;
    private String address;
    private boolean fragile;
    private String extraInformation;
    private String costumerName;
}
